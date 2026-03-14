/**
 * Client-side ambassador auth helpers.
 * Stores session token in localStorage. Ambassador portal uses simple
 * session tokens (not JWTs) — validated via /api/ambassador/auth/session.
 */

const SESSION_KEY = "rcf_ambassador_session";
const AMBASSADOR_KEY = "rcf_ambassador_user";

export interface AmbassadorUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  slug: string;
  locationId: string;
  totalPoints: number;
}

// ─── Session Management ───

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setSession(token: string, ambassador: AmbassadorUser): void {
  localStorage.setItem(SESSION_KEY, token);
  localStorage.setItem(AMBASSADOR_KEY, JSON.stringify(ambassador));
}

export function getAmbassadorUser(): AmbassadorUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(AMBASSADOR_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function isAmbassadorLoggedIn(): boolean {
  return !!getSessionToken();
}

export function ambassadorLogout(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(AMBASSADOR_KEY);
}

// ─── API Helpers ───

export async function requestAmbassadorMagicLink(email: string) {
  const res = await fetch("/api/ambassador/auth/magic-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function verifyAmbassadorToken(token: string) {
  const res = await fetch("/api/ambassador/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return res.json();
}

export async function validateAmbassadorSession(): Promise<{
  valid: boolean;
  ambassador?: AmbassadorUser;
}> {
  const token = getSessionToken();
  if (!token) return { valid: false };

  const res = await fetch(`/api/ambassador/auth/session?token=${token}`);
  const data = await res.json();

  if (data.valid && data.ambassador) {
    // Update cached user data
    localStorage.setItem(AMBASSADOR_KEY, JSON.stringify(data.ambassador));
  }

  return data;
}

export async function ambassadorSignup(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}) {
  const res = await fetch("/api/ambassador/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchAmbassadorStats(email: string) {
  const res = await fetch(`/api/ambassador/stats?email=${encodeURIComponent(email)}`);
  return res.json();
}

export async function fetchLeaderboard(period?: string) {
  const locationId = "mhVkT4IdOZj6jHuxoWTZ";
  const q = period ? `?period=${period}` : "";
  const res = await fetch(`/api/ambassador/leaderboard/${locationId}${q}`);
  return res.json();
}

export async function redeemAmbassadorReward(email: string, rewardName: string) {
  const res = await fetch("/api/ambassador/redeem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ambassadorEmail: email, rewardName }),
  });
  return res.json();
}
