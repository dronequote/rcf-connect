/**
 * Client-side authentication utilities for RCF Member Portal.
 * Handles magic link authentication with JWT tokens for congregation members.
 * Mirrors Zoo's auth.ts pattern.
 */

// Token storage keys (separate from staff tokens)
const MEMBER_ACCESS_TOKEN_KEY = "rcf_access_token";
const MEMBER_REFRESH_TOKEN_KEY = "rcf_refresh_token";
const MEMBER_TOKEN_EXPIRY_KEY = "rcf_token_expiry";
const MEMBER_USER_KEY = "rcf_member_user";

export interface MemberUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "member";
}

export interface MemberAuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  member: MemberUser;
}

/**
 * Request member magic link
 */
export async function requestMemberLogin(
  email: string
): Promise<{ success: boolean; message: string; devLink?: string }> {
  const response = await fetch("/api/auth/member/request-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to send login link" }));
    throw new Error(error.error || "Failed to send login link");
  }

  return response.json();
}

/**
 * Verify member magic link and store tokens
 */
export async function verifyMemberMagicLink(
  token: string
): Promise<MemberAuthResponse> {
  const response = await fetch("/api/auth/member/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Invalid or expired link" }));
    throw new Error(error.error || "Invalid or expired link");
  }

  const data: MemberAuthResponse = await response.json();
  setMemberTokens(data.accessToken, data.refreshToken, data.expiresAt);
  setMemberUser(data.member);
  return data;
}

/**
 * Refresh member access token
 */
export async function refreshMemberToken(): Promise<boolean> {
  const refreshToken = getMemberRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch("/api/auth/member/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearMemberTokens();
      }
      return false;
    }

    const data = await response.json();
    setMemberTokens(data.accessToken, data.refreshToken, data.expiresAt);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current member access token, refreshing if within 5 min of expiry
 */
export async function getMemberAccessToken(): Promise<string | null> {
  const token = localStorage.getItem(MEMBER_ACCESS_TOKEN_KEY);
  const expiry = localStorage.getItem(MEMBER_TOKEN_EXPIRY_KEY);

  if (!token) return null;

  if (expiry) {
    const expiryDate = new Date(expiry);
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;

    if (expiryDate.getTime() - now.getTime() < fiveMinutes) {
      const refreshed = await refreshMemberToken();
      if (!refreshed) return null;
      return localStorage.getItem(MEMBER_ACCESS_TOKEN_KEY);
    }
  }

  return token;
}

export function getMemberRefreshToken(): string | null {
  return localStorage.getItem(MEMBER_REFRESH_TOKEN_KEY);
}

export function setMemberTokens(
  accessToken: string,
  refreshToken: string,
  expiresAt: string
): void {
  localStorage.setItem(MEMBER_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(MEMBER_REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(MEMBER_TOKEN_EXPIRY_KEY, expiresAt);
}

export function clearMemberTokens(): void {
  localStorage.removeItem(MEMBER_ACCESS_TOKEN_KEY);
  localStorage.removeItem(MEMBER_REFRESH_TOKEN_KEY);
  localStorage.removeItem(MEMBER_TOKEN_EXPIRY_KEY);
  localStorage.removeItem(MEMBER_USER_KEY);
}

export function getMemberUser(): MemberUser | null {
  const userStr = localStorage.getItem(MEMBER_USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setMemberUser(user: MemberUser): void {
  localStorage.setItem(MEMBER_USER_KEY, JSON.stringify(user));
}

export function isMemberLoggedIn(): boolean {
  return !!localStorage.getItem(MEMBER_ACCESS_TOKEN_KEY);
}

export function memberLogout(): void {
  clearMemberTokens();
}

/**
 * Fetch with member authentication (auto-refreshes token)
 */
export async function fetchWithMemberAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getMemberAccessToken();
  if (!token) throw new Error("Not authenticated");

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, { ...options, headers });
}
