/**
 * Server-side auth utilities for RCF Connect.
 * Handles JWT signing/verification and magic link token generation.
 *
 * Used by Next.js API routes. NOT imported by client code.
 */

import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getDb } from "./mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "rcf-fallback-secret";

// ─── Types ───

export interface JwtPayload {
  userId: string;
  email: string;
  type: "rcf_member" | "rcf_admin";
  role?: "superadmin" | "admin";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

// ─── JWT ───

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "365d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function generateTokenPair(payload: JwtPayload): AuthTokens {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
  return { accessToken, refreshToken, expiresAt };
}

// ─── Magic Link ───

export function generateMagicLinkToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ─── Staff Auth ───

export async function requestStaffMagicLink(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const staff = await db
    .collection("rcfStaff")
    .findOne({ email: email.toLowerCase(), isActive: true });

  // Always return success to prevent email enumeration
  if (!staff) {
    return { success: true, message: "If that email is registered, a login link has been sent." };
  }

  const token = generateMagicLinkToken();
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.collection("rcfStaff").updateOne(
    { _id: staff._id },
    { $set: { magicLinkToken: token, magicLinkExpiry: expiry } }
  );

  // In production: send email via GHL
  // For local dev: return token in response so the login page can show the link
  const verifyUrl = `/admin/auth/verify?token=${token}`;

  console.log(`\n🔗 [RCF Staff Magic Link] ${staff.firstName} ${staff.lastName} (${email})`);
  console.log(`   ${verifyUrl}\n`);

  return {
    success: true,
    message: "If that email is registered, a login link has been sent.",
    // Dev only — remove in production
    devLink: verifyUrl,
    devToken: token,
  };
}

export async function verifyStaffMagicLink(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const staff = await db.collection("rcfStaff").findOne({
    magicLinkToken: token,
    magicLinkExpiry: { $gt: new Date() },
  });

  if (!staff) {
    throw new Error("Invalid or expired link");
  }

  // Clear magic link token (one-time use)
  await db.collection("rcfStaff").updateOne(
    { _id: staff._id },
    {
      $set: {
        magicLinkToken: null,
        magicLinkExpiry: null,
        lastLoginAt: new Date(),
      },
    }
  );

  const payload: JwtPayload = {
    userId: staff._id.toString(),
    email: staff.email,
    type: "rcf_admin",
    role: staff.role,
  };

  const tokens = generateTokenPair(payload);

  // Store refresh token
  await db.collection("rcfStaff").updateOne(
    { _id: staff._id },
    {
      $set: {
        refreshToken: tokens.refreshToken,
        refreshTokenExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    }
  );

  return {
    success: true,
    ...tokens,
    staff: {
      _id: staff._id.toString(),
      email: staff.email,
      firstName: staff.firstName,
      lastName: staff.lastName,
      role: staff.role,
    },
  };
}

export async function refreshStaffTokens(refreshToken: string) {
  const decoded = verifyToken(refreshToken);
  if (!decoded || decoded.type !== "rcf_admin") {
    throw new Error("Invalid refresh token");
  }

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const staff = await db.collection("rcfStaff").findOne({
    refreshToken,
    isActive: true,
  });

  if (!staff) {
    throw new Error("Invalid refresh token");
  }

  const payload: JwtPayload = {
    userId: staff._id.toString(),
    email: staff.email,
    type: "rcf_admin",
    role: staff.role,
  };

  const tokens = generateTokenPair(payload);

  await db.collection("rcfStaff").updateOne(
    { _id: staff._id },
    { $set: { refreshToken: tokens.refreshToken } }
  );

  return { success: true, ...tokens };
}

// ─── Admin Route Auth Guard ───

export async function requireStaffAuth(
  request: Request
): Promise<JwtPayload | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded || decoded.type !== "rcf_admin") return null;

  return decoded;
}

// ─── Member Auth ───

export async function requestMemberMagicLink(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const member = await db
    .collection("rcfMembers")
    .findOne({ email: email.toLowerCase() });

  if (!member) {
    return { success: true, message: "If that email is registered, a login link has been sent." };
  }

  const token = generateMagicLinkToken();
  const expiry = new Date(Date.now() + 60 * 60 * 1000);

  await db.collection("rcfMembers").updateOne(
    { _id: member._id },
    { $set: { magicLinkToken: token, magicLinkExpiry: expiry } }
  );

  const verifyUrl = `/auth/verify?token=${token}`;

  console.log(`\n🔗 [RCF Member Magic Link] ${member.firstName} ${member.lastName} (${email})`);
  console.log(`   ${verifyUrl}\n`);

  return {
    success: true,
    message: "If that email is registered, a login link has been sent.",
    devLink: verifyUrl,
    devToken: token,
  };
}

export async function verifyMemberMagicLink(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const member = await db.collection("rcfMembers").findOne({
    magicLinkToken: token,
    magicLinkExpiry: { $gt: new Date() },
  });

  if (!member) {
    throw new Error("Invalid or expired link");
  }

  await db.collection("rcfMembers").updateOne(
    { _id: member._id },
    {
      $set: {
        magicLinkToken: null,
        magicLinkExpiry: null,
        lastLoginAt: new Date(),
      },
    }
  );

  const payload: JwtPayload = {
    userId: member._id.toString(),
    email: member.email,
    type: "rcf_member",
  };

  const tokens = generateTokenPair(payload);

  await db.collection("rcfMembers").updateOne(
    { _id: member._id },
    {
      $set: {
        refreshToken: tokens.refreshToken,
        refreshTokenExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    }
  );

  return {
    success: true,
    ...tokens,
    member: {
      _id: member._id.toString(),
      email: member.email,
      firstName: member.firstName,
      lastName: member.lastName,
      role: "member",
    },
  };
}

export async function refreshMemberTokens(refreshToken: string) {
  const decoded = verifyToken(refreshToken);
  if (!decoded || decoded.type !== "rcf_member") {
    throw new Error("Invalid refresh token");
  }

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const member = await db.collection("rcfMembers").findOne({ refreshToken });

  if (!member) {
    throw new Error("Invalid refresh token");
  }

  const payload: JwtPayload = {
    userId: member._id.toString(),
    email: member.email,
    type: "rcf_member",
  };

  const tokens = generateTokenPair(payload);

  await db.collection("rcfMembers").updateOne(
    { _id: member._id },
    { $set: { refreshToken: tokens.refreshToken } }
  );

  return { success: true, ...tokens };
}
