/**
 * Ambassador system types for RCF Connect.
 * Mirrors the LPAI ambassador system adapted for church context.
 */

// ─── Config ───

export interface AmbassadorBranding {
  name: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
  tagline: string;
  supportEmail: string;
}

export interface TrackableProduct {
  productId: string;
  productName: string;
  provider: "ghl" | "manual";
  enabled: boolean;
  rewardType: "points" | "commission";
  rewardValue: number;
  category: string;
}

export interface AmbassadorReward {
  _id?: string;
  name: string;
  description: string;
  pointCost: number;
  imageUrl: string;
  active: boolean;
  quantityAvailable?: number;
}

export interface LeaderboardConfig {
  enabled: boolean;
  showTopN: number;
  resetPeriod: "monthly" | "quarterly" | "yearly" | "never";
  displayMetric: "points" | "referrals";
}

export interface AmbassadorConfig {
  locationId: string;
  programName: string;
  programEnabled: boolean;
  programType: "points";
  autoApproveAmbassadors: boolean;
  attributionWindowDays: number;
  branding: AmbassadorBranding;
  trackableProducts: TrackableProduct[];
  rewards: AmbassadorReward[];
  leaderboard: LeaderboardConfig;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Ambassador ───

export type AmbassadorStatus = "active" | "suspended" | "pending";

export interface Ambassador {
  _id?: string;
  id?: string;
  locationId: string;
  email: string;
  slug: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: AmbassadorStatus;
  totalPoints: number;
  totalReferrals: number;
  totalClicks: number;
  groupId?: string;
  riskScore?: number;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Click Tracking ───

export interface AmbassadorClick {
  _id?: string;
  locationId: string;
  ambassadorId: string;
  ambassadorSlug: string;
  ambassadorEmail: string;
  sessionId: string;
  path: string;
  destination: string;
  ipHash: string;
  userAgent: string;
  referer: string;
  createdAt: string;
}

// ─── Conversions ───

export interface ConversionItem {
  product: string;
  quantity: number;
  amount: number;
  pointsAwarded: number;
}

export interface AmbassadorConversion {
  _id?: string;
  locationId: string;
  ambassadorId: string;
  ambassadorEmail: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string;
  items: ConversionItem[];
  totalPointsAwarded: number;
  attributionMethod: "cookie" | "form_tag" | "manual";
  sessionId?: string;
  landingPath?: string;
  status: "confirmed";
  createdAt: string;
}

// ─── Sessions & Auth ───

export interface AmbassadorSession {
  locationId: string;
  ambassadorId: string;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface AmbassadorAuthToken {
  locationId: string;
  ambassadorId: string;
  email: string;
  token: string;
  type: "magic_link";
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

// ─── Redemptions ───

export type RedemptionStatus = "pending" | "fulfilled";

export interface AmbassadorRedemption {
  _id?: string;
  id?: string;
  locationId: string;
  ambassadorId: string;
  ambassadorEmail: string;
  rewardName: string;
  pointsCost: number;
  status: RedemptionStatus;
  adminNote?: string;
  createdAt: string;
}

// ─── Stats ───

export interface AmbassadorStats {
  ambassador: Ambassador;
  recentClicks: AmbassadorClick[];
  recentConversions: AmbassadorConversion[];
  clicksThisMonth: number;
  conversionsThisMonth: number;
  pointsThisMonth: number;
}

// ─── Leaderboard ───

export interface LeaderboardEntry {
  rank: number;
  firstName: string;
  lastName: string;
  totalPoints: number;
  totalReferrals: number;
  totalClicks: number;
}
