/**
 * Ambassador service library for RCF Connect.
 * Adapted from LPAI ambassador.service.ts (3,000+ lines) for church context.
 *
 * Key differences from LPAI:
 * - No GHL enrichment (church doesn't use GHL CRM)
 * - No commission system (church uses points only)
 * - No Stripe/payment integration
 * - No coupon generation (rewards are fulfilled manually by staff)
 * - Simplified fraud detection (church context, lower volume)
 * - Collections prefixed with rcfAmbassador*
 */

import crypto from "crypto";
import { ObjectId, type Db } from "mongodb";
import { getDb } from "./mongodb";

const RCF_LOCATION_ID = "mhVkT4IdOZj6jHuxoWTZ";

// ─── Fraud Detection Constants ───

const DISPOSABLE_EMAIL_DOMAINS = [
  "tempmail.com", "guerrillamail.com", "mailinator.com", "10minutemail.com",
  "throwaway.email", "temp-mail.org", "yopmail.com", "getnada.com",
  "mohmal.com", "fakeinbox.com", "sharklasers.com", "guerrillamailblock.com",
  "grr.la", "dispostable.com", "trashmail.com", "tempail.com",
  "emailondeck.com", "mailnesia.com", "maildrop.cc", "meltmail.com",
  "harakirimail.com", "mintemail.com", "mytemp.email", "tempinbox.com",
  "burnermail.io", "inboxbear.com", "spamgourmet.com", "jetable.org",
  "filzmail.com", "mailforspam.com", "safetymail.info", "trashmail.me",
  "tmpmail.net", "tmpmail.org", "boun.cr", "mailnull.com",
  "spamfree24.org", "trash-mail.at", "whatpaas.com", "bugmenot.com",
];

const SPAM_TLDS = [
  ".ru", ".cn", ".tk", ".ml", ".ga", ".cf", ".gq",
  ".xyz", ".top", ".buzz", ".icu", ".work", ".click",
  ".surf", ".monster", ".casa", ".cyou", ".cfd",
  ".rest", ".boats", ".beauty", ".hair", ".skin",
  ".sbs", ".autos", ".wiki",
];

const TRUSTED_EMAIL_PROVIDERS = [
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "live.com",
  "icloud.com", "me.com", "mac.com", "aol.com", "protonmail.com",
  "proton.me", "zoho.com", "mail.com", "gmx.com",
  "comcast.net", "verizon.net", "att.net", "sbcglobal.net",
];

const SUSPICIOUS_EMAIL_PATTERNS = [
  /^test\d+@/i, /^fake\d+@/i, /^spam\d+@/i, /^temp\d+@/i,
  /^asdf/i, /^abc\d{3,}@/i, /^[a-z]{1,2}\d{5,}@/i,
  /^user\d{3,}@/i, /^admin\d+@/i, /^noreply/i, /^no-reply/i,
  /^[a-z0-9]{20,}@/i, /^\d{8,}@/i,
];

// ─── Helper: Get DB ───

async function requireDb(): Promise<Db> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db;
}

// ─── Fraud Detection ───

function calculateEntropy(str: string): number {
  if (!str || str.length === 0) return 0;
  const freq: Record<string, number> = {};
  for (const char of str.toLowerCase()) {
    freq[char] = (freq[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const count of Object.values(freq)) {
    const p = count / len;
    if (p > 0) entropy -= p * Math.log2(p);
  }
  return entropy;
}

function isGibberish(text: string): { isGibberish: boolean; score: number; reasons: string[] } {
  if (!text || text.length < 2) return { isGibberish: false, score: 0, reasons: [] };
  const reasons: string[] = [];
  let score = 0;
  const lower = text.toLowerCase().replace(/[^a-z]/g, "");
  if (lower.length === 0) return { isGibberish: false, score: 0, reasons: [] };

  const entropy = calculateEntropy(lower);
  if (entropy > 4.0 && lower.length > 6) { reasons.push(`High entropy: ${entropy.toFixed(2)}`); score += 30; }
  else if (entropy > 3.8 && lower.length > 8) { reasons.push(`Elevated entropy: ${entropy.toFixed(2)}`); score += 15; }

  const consonantRuns = lower.match(/[^aeiou]{4,}/g) || [];
  if (consonantRuns.length > 0) {
    const longestRun = Math.max(...consonantRuns.map((r) => r.length));
    if (longestRun >= 5) { reasons.push(`Long consonant cluster: ${longestRun} chars`); score += 25; }
    else if (longestRun >= 4) { reasons.push(`Consonant cluster: ${longestRun} chars`); score += 10; }
  }

  const vowelCount = [...lower].filter((c) => "aeiou".includes(c)).length;
  const vowelRatio = vowelCount / lower.length;
  if (vowelRatio < 0.15 && lower.length > 4) { reasons.push(`Very low vowel ratio: ${(vowelRatio * 100).toFixed(0)}%`); score += 20; }
  else if (vowelRatio < 0.20 && lower.length > 6) { reasons.push(`Low vowel ratio: ${(vowelRatio * 100).toFixed(0)}%`); score += 10; }

  const alphaChars = text.replace(/[^a-zA-Z]/g, "");
  if (alphaChars.length > 5) {
    const caseChanges = [...alphaChars].filter((c, i) => {
      if (i === 0) return false;
      return (alphaChars[i - 1] === alphaChars[i - 1].toUpperCase()) !== (c === c.toUpperCase());
    }).length;
    if (caseChanges / alphaChars.length > 0.4) { reasons.push(`Excessive case changes`); score += 20; }
  }

  if (lower.length > 20) { reasons.push(`Unusually long: ${lower.length} chars`); score += 15; }

  return { isGibberish: score >= 30, score, reasons };
}

async function performFraudCheck(
  db: Db,
  email: string,
  firstName: string,
  lastName: string,
  phone?: string,
): Promise<{ allowed: boolean; riskScore: number; reasons: string[]; warnings: string[] }> {
  const reasons: string[] = [];
  const warnings: string[] = [];
  let riskScore = 0;

  const domain = email.split("@")[1]?.toLowerCase() || "";

  // 1. Disposable email
  if (DISPOSABLE_EMAIL_DOMAINS.some((d) => domain.includes(d))) {
    reasons.push("Disposable email address"); riskScore += 40;
  }

  // 2. Spam TLD
  if (!TRUSTED_EMAIL_PROVIDERS.includes(domain)) {
    const tld = "." + domain.split(".").pop();
    if (SPAM_TLDS.includes(tld)) { reasons.push(`Spam TLD: ${tld}`); riskScore += 35; }
  }

  // 3. Suspicious email pattern
  if (SUSPICIOUS_EMAIL_PATTERNS.some((p) => p.test(email))) {
    warnings.push("Suspicious email pattern"); riskScore += 20;
  }

  // 4. Gibberish name
  const fnCheck = isGibberish(firstName);
  const lnCheck = isGibberish(lastName);
  if (fnCheck.isGibberish) { reasons.push(`First name auto-generated`); riskScore += 35; }
  if (lnCheck.isGibberish) { reasons.push(`Last name auto-generated`); riskScore += 35; }

  // 5. Name too short
  if (firstName.length < 2 || lastName.length < 2) { reasons.push("Name too short"); riskScore += 15; }

  // 6. All-numeric name
  if (/^\d+$/.test(firstName) || /^\d+$/.test(lastName)) { reasons.push("Name contains only digits"); riskScore += 30; }

  // 7. Domain velocity
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const escapedDomain = domain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const domainCount = await db.collection("rcfAmbassadors").countDocuments({
      locationId: RCF_LOCATION_ID,
      email: { $regex: `@${escapedDomain}$`, $options: "i" },
      createdAt: { $gte: oneHourAgo },
    });
    if (domainCount >= 5) { reasons.push(`${domainCount} signups from @${domain} in last hour`); riskScore += 40; }
    else if (domainCount >= 3) { warnings.push(`${domainCount} signups from @${domain} in last hour`); riskScore += 25; }
  } catch { /* non-critical */ }

  // 8. Global velocity
  try {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentSignups = await db.collection("rcfAmbassadors").countDocuments({
      locationId: RCF_LOCATION_ID,
      createdAt: { $gte: tenMinAgo },
    });
    if (recentSignups >= 10) { reasons.push(`${recentSignups} signups in last 10 min`); riskScore += 30; }
  } catch { /* non-critical */ }

  return { allowed: riskScore <= 40, riskScore, reasons, warnings };
}

// ─── CONFIG ───

export async function getConfig() {
  const db = await requireDb();
  return db.collection("rcfAmbassadorConfig").findOne({ locationId: RCF_LOCATION_ID });
}

// ─── SIGNUP ───

export async function signup(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}) {
  const db = await requireDb();
  const email = data.email.toLowerCase().trim();

  const existing = await db.collection("rcfAmbassadors").findOne({
    locationId: RCF_LOCATION_ID,
    email,
  });
  if (existing) return { error: "Email already registered as ambassador" };

  const fraudCheck = await performFraudCheck(db, email, data.firstName, data.lastName, data.phone);
  if (!fraudCheck.allowed) {
    console.warn(`Ambassador signup BLOCKED: ${email} (risk=${fraudCheck.riskScore})`);
    return { error: "Signup could not be completed. Please contact the church office." };
  }

  let slug = `${data.firstName}-${data.lastName}`.toLowerCase().replace(/[^a-z0-9]/g, "-");
  let counter = 1;
  while (await db.collection("rcfAmbassadors").findOne({ locationId: RCF_LOCATION_ID, slug })) {
    slug = `${data.firstName}-${data.lastName}-${counter}`.toLowerCase().replace(/[^a-z0-9]/g, "-");
    counter++;
  }

  const config = await getConfig();
  const status = config?.autoApproveAmbassadors ? "active" : "pending";

  const ambassador = {
    locationId: RCF_LOCATION_ID,
    email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone || "",
    slug,
    status,
    totalPoints: 0,
    totalReferrals: 0,
    totalClicks: 0,
    riskScore: fraudCheck.riskScore,
    riskReasons: [...fraudCheck.reasons, ...fraudCheck.warnings],
    joinedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("rcfAmbassadors").insertOne(ambassador);

  console.log(`[Ambassador] New signup: ${email} → ${slug}`);
  return { success: true, ambassadorId: result.insertedId.toString(), slug, status };
}

// ─── MAGIC LINK AUTH ───

export async function requestMagicLink(email: string) {
  const db = await requireDb();
  const normalizedEmail = email.toLowerCase().trim();

  const ambassador = await db.collection("rcfAmbassadors").findOne({
    locationId: RCF_LOCATION_ID,
    email: normalizedEmail,
  });

  if (!ambassador) {
    return { success: true, message: "If an account exists, a login link has been sent" };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.collection("rcfAmbassadorAuthTokens").insertOne({
    locationId: RCF_LOCATION_ID,
    ambassadorId: ambassador._id.toString(),
    email: normalizedEmail,
    token,
    type: "magic_link",
    expiresAt,
    createdAt: new Date(),
  });

  const verifyUrl = `/ambassador/verify?token=${token}`;
  console.log(`\n🔗 [Ambassador Magic Link] ${ambassador.firstName} ${ambassador.lastName} (${normalizedEmail})`);
  console.log(`   ${verifyUrl}\n`);

  return {
    success: true,
    message: "If an account exists, a login link has been sent",
    devLink: verifyUrl,
    devToken: token,
  };
}

export async function verifyMagicLink(token: string) {
  const db = await requireDb();

  const authToken = await db.collection("rcfAmbassadorAuthTokens").findOne({
    token,
    type: "magic_link",
    expiresAt: { $gt: new Date() },
    usedAt: { $exists: false },
  });

  if (!authToken) return { valid: false, error: "Invalid or expired token" };

  await db.collection("rcfAmbassadorAuthTokens").updateOne(
    { _id: authToken._id },
    { $set: { usedAt: new Date() } },
  );

  const ambassador = await db.collection("rcfAmbassadors").findOne({
    _id: new ObjectId(authToken.ambassadorId),
  });

  if (!ambassador) return { valid: false, error: "Ambassador not found" };

  const sessionToken = crypto.randomBytes(48).toString("hex");
  const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.collection("rcfAmbassadorSessions").insertOne({
    locationId: RCF_LOCATION_ID,
    ambassadorId: ambassador._id.toString(),
    email: ambassador.email,
    token: sessionToken,
    expiresAt: sessionExpiry,
    createdAt: new Date(),
  });

  return {
    valid: true,
    sessionToken,
    ambassador: {
      id: ambassador._id.toString(),
      email: ambassador.email,
      firstName: ambassador.firstName,
      lastName: ambassador.lastName,
      slug: ambassador.slug,
      locationId: ambassador.locationId,
      totalPoints: ambassador.totalPoints || 0,
    },
  };
}

export async function validateSession(sessionToken: string) {
  const db = await requireDb();

  const session = await db.collection("rcfAmbassadorSessions").findOne({
    token: sessionToken,
    expiresAt: { $gt: new Date() },
  });

  if (!session) return { valid: false };

  const ambassador = await db.collection("rcfAmbassadors").findOne({
    _id: new ObjectId(session.ambassadorId),
  });

  if (!ambassador || ambassador.status !== "active") return { valid: false };

  return {
    valid: true,
    ambassador: {
      id: ambassador._id.toString(),
      email: ambassador.email,
      firstName: ambassador.firstName,
      lastName: ambassador.lastName,
      slug: ambassador.slug,
      locationId: ambassador.locationId,
      totalPoints: ambassador.totalPoints || 0,
    },
  };
}

// ─── CLICK TRACKING ───

export async function trackClick(data: {
  ambassadorSlug: string;
  sessionId?: string;
  ipAddress: string;
  userAgent: string;
  referer: string;
  path?: string;
  destination?: string;
}) {
  const db = await requireDb();

  const ambassador = await db.collection("rcfAmbassadors").findOne({
    locationId: RCF_LOCATION_ID,
    slug: data.ambassadorSlug.toLowerCase().trim(),
    status: "active",
  });

  if (!ambassador) return { success: false, error: "Invalid ambassador" };

  // Dedup by session
  if (data.sessionId) {
    const existing = await db.collection("rcfAmbassadorClicks").findOne({
      sessionId: data.sessionId,
      ambassadorId: ambassador._id.toString(),
    });
    if (existing) return { success: true, message: "Click already tracked", clickId: existing._id.toString() };
  }

  const sessionId = data.sessionId || crypto.randomBytes(16).toString("hex");
  const ipHash = crypto.createHash("sha256").update(data.ipAddress || "unknown").digest("hex");

  const result = await db.collection("rcfAmbassadorClicks").insertOne({
    locationId: RCF_LOCATION_ID,
    ambassadorId: ambassador._id.toString(),
    ambassadorSlug: ambassador.slug,
    ambassadorEmail: ambassador.email,
    sessionId,
    path: data.path || "/",
    destination: data.destination || "/",
    ipHash,
    userAgent: data.userAgent || "",
    referer: data.referer || "",
    createdAt: new Date(),
  });

  await db.collection("rcfAmbassadors").updateOne(
    { _id: ambassador._id },
    { $inc: { totalClicks: 1 }, $set: { updatedAt: new Date() } },
  );

  return { success: true, clickId: result.insertedId.toString(), sessionId };
}

// ─── CONVERSION / ATTRIBUTION ───

export async function recordConversion(data: {
  ambassadorEmail: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string;
  items: Array<{ productId: string; productName?: string; quantity: number; amount: number }>;
  sessionId?: string;
  attributionMethod?: string;
  landingPath?: string;
}) {
  const db = await requireDb();
  const ambassadorEmail = data.ambassadorEmail.toLowerCase().trim();
  const visitorEmail = data.visitorEmail.toLowerCase().trim();

  // Look up ambassador by email or slug
  let ambassador = await db.collection("rcfAmbassadors").findOne({
    locationId: RCF_LOCATION_ID,
    email: ambassadorEmail,
    status: "active",
  });

  if (!ambassador) {
    ambassador = await db.collection("rcfAmbassadors").findOne({
      locationId: RCF_LOCATION_ID,
      slug: data.ambassadorEmail.toLowerCase().trim(),
      status: "active",
    });
  }

  if (!ambassador) return { success: false, error: "Ambassador not found" };

  // Block self-referral
  if (ambassador.email === visitorEmail) {
    return { success: false, error: "Self-referral not allowed" };
  }

  const config = await getConfig();
  const productMap = new Map(
    (config?.trackableProducts || []).map((p: any) => [p.productId, p]),
  );

  // Calculate points per item
  let totalPointsAwarded = 0;
  const itemResults: any[] = [];

  for (const item of data.items) {
    const productConfig: any = productMap.get(item.productId);
    if (!productConfig || !productConfig.enabled) {
      itemResults.push({ productId: item.productId, tracked: false, reason: "Product not configured" });
      continue;
    }

    let pointsAwarded = productConfig.rewardValue * item.quantity;

    // Apply active promotions
    const now = new Date();
    for (const promo of config?.promotions || []) {
      if (!promo.active) continue;
      if (new Date(promo.startDate) > now || new Date(promo.endDate) < now) continue;
      if (promo.category && promo.category !== productConfig.category) continue;
      if (promo.type === "multiplier") pointsAwarded = Math.round(pointsAwarded * promo.value);
      else if (promo.type === "bonus") pointsAwarded += promo.value;
    }

    totalPointsAwarded += pointsAwarded;
    itemResults.push({
      productId: item.productId,
      productName: item.productName || productConfig.productName,
      quantity: item.quantity,
      tracked: true,
      pointsAwarded,
    });
  }

  const attributionMethod = data.attributionMethod || "cookie";

  const conversion = {
    locationId: RCF_LOCATION_ID,
    ambassadorId: ambassador._id.toString(),
    ambassadorEmail: ambassador.email,
    visitorName: data.visitorName || "",
    visitorEmail,
    visitorPhone: data.visitorPhone || "",
    items: itemResults,
    totalPointsAwarded,
    attributionMethod,
    sessionId: data.sessionId || "",
    landingPath: data.landingPath || "",
    status: "confirmed" as const,
    createdAt: new Date(),
  };

  const insertResult = await db.collection("rcfAmbassadorConversions").insertOne(conversion);

  // Update ambassador totals
  await db.collection("rcfAmbassadors").updateOne(
    { _id: ambassador._id },
    {
      $inc: { totalReferrals: 1, totalPoints: totalPointsAwarded },
      $set: { updatedAt: new Date() },
    },
  );

  console.log(`[Ambassador] Conversion: ${ambassador.email} earned ${totalPointsAwarded}pts from ${visitorEmail}`);

  return {
    success: true,
    conversionId: insertResult.insertedId.toString(),
    totalPointsAwarded,
    items: itemResults,
    newPointsTotal: (ambassador.totalPoints || 0) + totalPointsAwarded,
  };
}

// ─── STATS ───

export async function getStats(email: string) {
  const db = await requireDb();
  const normalizedEmail = email.toLowerCase().trim();

  const ambassador = await db.collection("rcfAmbassadors").findOne({
    locationId: RCF_LOCATION_ID,
    email: normalizedEmail,
  });

  if (!ambassador) return { error: "Ambassador not found" };

  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ambId = ambassador._id.toString();

  const [
    totalClicks,
    recentClickCount,
    totalConversions,
    recentConversions,
    conversionHistory,
    clickHistory,
    redemptions,
  ] = await Promise.all([
    db.collection("rcfAmbassadorClicks").countDocuments({ ambassadorId: ambId }),
    db.collection("rcfAmbassadorClicks").countDocuments({ ambassadorId: ambId, createdAt: { $gte: last30Days } }),
    db.collection("rcfAmbassadorConversions").countDocuments({ ambassadorId: ambId, status: "confirmed" }),
    db.collection("rcfAmbassadorConversions").countDocuments({ ambassadorId: ambId, status: "confirmed", createdAt: { $gte: thisMonth } }),
    db.collection("rcfAmbassadorConversions").find({ ambassadorId: ambId, status: "confirmed" }).sort({ createdAt: -1 }).limit(20).toArray(),
    db.collection("rcfAmbassadorClicks").find({ ambassadorId: ambId }).sort({ createdAt: -1 }).limit(15).toArray(),
    db.collection("rcfAmbassadorRedemptions").find({ ambassadorId: ambId }).sort({ createdAt: -1 }).limit(10).toArray(),
  ]);

  const config = await getConfig();

  return {
    ambassador: {
      id: ambassador._id.toString(),
      email: ambassador.email,
      firstName: ambassador.firstName,
      lastName: ambassador.lastName,
      slug: ambassador.slug,
      status: ambassador.status,
      totalPoints: ambassador.totalPoints || 0,
      totalClicks,
      totalConversions,
      joinedAt: ambassador.joinedAt,
    },
    stats: {
      totalClicks,
      recentClicks: recentClickCount,
      totalReferrals: totalConversions,
      thisMonthReferrals: recentConversions,
      totalPoints: ambassador.totalPoints || 0,
      conversionRate: totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0",
    },
    recentConversions: conversionHistory.map((c) => ({
      id: c._id.toString(),
      visitorName: c.visitorName || "Anonymous",
      totalPointsAwarded: c.totalPointsAwarded,
      items: (c.items || []).filter((i: any) => i.tracked).map((i: any) => ({ productName: i.productName })),
      createdAt: c.createdAt,
    })),
    recentClicks: clickHistory.map((c) => ({
      id: c._id.toString(),
      path: c.path || "/",
      referer: c.referer || "",
      createdAt: c.createdAt,
    })),
    redemptions: redemptions.map((r) => ({
      id: r._id.toString(),
      rewardName: r.rewardName,
      pointsCost: r.pointsCost,
      status: r.status,
      createdAt: r.createdAt,
    })),
    rewards: (config?.rewards || []).filter((r: any) => r.active),
    referralLink: `/ref/${ambassador.slug}`,
  };
}

// ─── LEADERBOARD ───

export async function getLeaderboard(period?: string) {
  const db = await requireDb();
  const config = await getConfig();

  if (!config?.leaderboard?.enabled) return { enabled: false, entries: [] };

  const resetPeriod = period || config.leaderboard.resetPeriod || "monthly";
  const showTopN = config.leaderboard.showTopN || 10;
  const metric = config.leaderboard.displayMetric || "points";

  let dateFilter: any = {};
  const now = new Date();
  if (resetPeriod === "monthly") {
    dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
  } else if (resetPeriod === "quarterly") {
    const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    dateFilter = { createdAt: { $gte: quarterStart } };
  } else if (resetPeriod === "yearly") {
    dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
  }

  const sortField = metric === "points" ? "totalPoints" : "referralCount";

  const leaderboard = await db.collection("rcfAmbassadorConversions").aggregate([
    { $match: { locationId: RCF_LOCATION_ID, status: "confirmed", ...dateFilter } },
    {
      $group: {
        _id: "$ambassadorId",
        totalPoints: { $sum: "$totalPointsAwarded" },
        referralCount: { $sum: 1 },
      },
    },
    { $sort: { [sortField]: -1 } },
    { $limit: showTopN },
  ]).toArray();

  // Enrich with names
  const ambassadorIds = leaderboard.map((l) => new ObjectId(l._id));
  const ambassadors = await db.collection("rcfAmbassadors")
    .find({ _id: { $in: ambassadorIds } })
    .toArray();
  const ambassadorMap = new Map(ambassadors.map((a) => [a._id.toString(), a]));

  return {
    enabled: true,
    period: resetPeriod,
    metric,
    entries: leaderboard.map((l, index) => {
      const amb = ambassadorMap.get(l._id);
      return {
        rank: index + 1,
        firstName: amb?.firstName || "Unknown",
        lastName: amb?.lastName?.[0] ? amb.lastName[0] + "." : "",
        totalPoints: l.totalPoints,
        referralCount: l.referralCount,
      };
    }),
  };
}

// ─── REWARDS / REDEMPTION ───

export async function redeemReward(ambassadorEmail: string, rewardName: string) {
  const db = await requireDb();
  const email = ambassadorEmail.toLowerCase().trim();

  const ambassador = await db.collection("rcfAmbassadors").findOne({
    locationId: RCF_LOCATION_ID,
    email,
    status: "active",
  });
  if (!ambassador) return { error: "Ambassador not found" };

  const config = await getConfig();
  const reward = (config?.rewards || []).find((r: any) => r.name === rewardName);
  if (!reward || !reward.active) return { error: "Reward not available" };

  if ((ambassador.totalPoints || 0) < reward.pointCost) {
    return { error: "Insufficient points", currentPoints: ambassador.totalPoints, required: reward.pointCost };
  }

  // Deduct points
  await db.collection("rcfAmbassadors").updateOne(
    { _id: ambassador._id },
    { $inc: { totalPoints: -reward.pointCost }, $set: { updatedAt: new Date() } },
  );

  // Create redemption record (staff fulfills manually)
  const redemption = {
    locationId: RCF_LOCATION_ID,
    ambassadorId: ambassador._id.toString(),
    ambassadorEmail: email,
    ambassadorName: `${ambassador.firstName} ${ambassador.lastName}`,
    rewardName: reward.name,
    pointsCost: reward.pointCost,
    status: "pending" as const,
    createdAt: new Date(),
  };

  await db.collection("rcfAmbassadorRedemptions").insertOne(redemption);

  console.log(`[Ambassador] Reward redeemed: ${email} → "${reward.name}" for ${reward.pointCost}pts`);

  return {
    success: true,
    rewardName: reward.name,
    pointsDeducted: reward.pointCost,
    newBalance: (ambassador.totalPoints || 0) - reward.pointCost,
  };
}

export async function getRedemptions(status?: string) {
  const db = await requireDb();
  const query: any = { locationId: RCF_LOCATION_ID };
  if (status) query.status = status;

  return db.collection("rcfAmbassadorRedemptions")
    .find(query)
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();
}

export async function fulfillRedemption(redemptionId: string, adminNote?: string) {
  const db = await requireDb();

  const result = await db.collection("rcfAmbassadorRedemptions").findOneAndUpdate(
    { _id: new ObjectId(redemptionId), status: "pending" },
    { $set: { status: "fulfilled", fulfilledAt: new Date(), adminNote: adminNote || "" } },
    { returnDocument: "after" },
  );

  if (!result) return { error: "Redemption not found or already fulfilled" };
  return { success: true, redemption: result };
}

// ─── ADMIN ───

export async function getAmbassadors() {
  const db = await requireDb();

  const ambassadors = await db.collection("rcfAmbassadors")
    .find({ locationId: RCF_LOCATION_ID })
    .sort({ joinedAt: -1 })
    .toArray();

  return ambassadors.map((a) => ({
    id: a._id.toString(),
    email: a.email,
    firstName: a.firstName,
    lastName: a.lastName,
    slug: a.slug,
    status: a.status,
    totalPoints: a.totalPoints || 0,
    totalReferrals: a.totalReferrals || 0,
    totalClicks: a.totalClicks || 0,
    joinedAt: a.joinedAt,
    riskScore: a.riskScore || 0,
  }));
}

export async function updateAmbassadorStatus(ambassadorId: string, status: string) {
  const db = await requireDb();

  const result = await db.collection("rcfAmbassadors").findOneAndUpdate(
    { _id: new ObjectId(ambassadorId) },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" },
  );

  if (!result) return { error: "Ambassador not found" };
  return { success: true, status: result.status };
}

export async function deleteAmbassador(ambassadorId: string) {
  const db = await requireDb();

  const ambassador = await db.collection("rcfAmbassadors").findOne({ _id: new ObjectId(ambassadorId) });
  if (!ambassador) return { error: "Ambassador not found" };

  const idStr = ambassador._id.toString();

  await Promise.all([
    db.collection("rcfAmbassadors").deleteOne({ _id: ambassador._id }),
    db.collection("rcfAmbassadorClicks").deleteMany({ ambassadorId: idStr }),
    db.collection("rcfAmbassadorConversions").deleteMany({ ambassadorId: idStr }),
    db.collection("rcfAmbassadorAuthTokens").deleteMany({ ambassadorId: idStr }),
    db.collection("rcfAmbassadorSessions").deleteMany({ ambassadorId: idStr }),
    db.collection("rcfAmbassadorRedemptions").deleteMany({ ambassadorId: idStr }),
  ]);

  return { success: true, deleted: idStr };
}

export async function getAdminDashboard() {
  const db = await requireDb();
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalAmbassadors,
    activeAmbassadors,
    totalClicks,
    thisMonthClicks,
    totalConversions,
    thisMonthConversions,
    totalPointsResult,
    pendingRedemptions,
  ] = await Promise.all([
    db.collection("rcfAmbassadors").countDocuments({ locationId: RCF_LOCATION_ID }),
    db.collection("rcfAmbassadors").countDocuments({ locationId: RCF_LOCATION_ID, status: "active" }),
    db.collection("rcfAmbassadorClicks").countDocuments({ locationId: RCF_LOCATION_ID }),
    db.collection("rcfAmbassadorClicks").countDocuments({ locationId: RCF_LOCATION_ID, createdAt: { $gte: thisMonth } }),
    db.collection("rcfAmbassadorConversions").countDocuments({ locationId: RCF_LOCATION_ID, status: "confirmed" }),
    db.collection("rcfAmbassadorConversions").countDocuments({ locationId: RCF_LOCATION_ID, status: "confirmed", createdAt: { $gte: thisMonth } }),
    db.collection("rcfAmbassadorConversions").aggregate([
      { $match: { locationId: RCF_LOCATION_ID, status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$totalPointsAwarded" } } },
    ]).toArray(),
    db.collection("rcfAmbassadorRedemptions").countDocuments({ locationId: RCF_LOCATION_ID, status: "pending" }),
  ]);

  return {
    ambassadors: { total: totalAmbassadors, active: activeAmbassadors },
    clicks: { total: totalClicks, thisMonth: thisMonthClicks },
    conversions: { total: totalConversions, thisMonth: thisMonthConversions },
    totalPointsAwarded: totalPointsResult[0]?.total || 0,
    pendingRedemptions,
    conversionRate: totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0",
  };
}
