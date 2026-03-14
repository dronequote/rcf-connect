/**
 * Client-side authentication utilities for RCF Staff Portal.
 * Handles magic link authentication with JWT tokens for staff/admins.
 * Mirrors Zoo's admin-auth.ts pattern.
 */

// Token storage keys (separate from member tokens)
const STAFF_ACCESS_TOKEN_KEY = "rcf_staff_access_token";
const STAFF_REFRESH_TOKEN_KEY = "rcf_staff_refresh_token";
const STAFF_TOKEN_EXPIRY_KEY = "rcf_staff_token_expiry";
const STAFF_USER_KEY = "rcf_staff_user";

export interface StaffUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "superadmin" | "admin";
}

export interface StaffAuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  staff: StaffUser;
}

/**
 * Request staff magic link
 */
export async function requestStaffLogin(
  email: string
): Promise<{ success: boolean; message: string; devLink?: string }> {
  const response = await fetch("/api/auth/staff/request-link", {
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
 * Verify staff magic link and store tokens
 */
export async function verifyStaffMagicLink(
  token: string
): Promise<StaffAuthResponse> {
  const response = await fetch("/api/auth/staff/verify", {
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

  const data: StaffAuthResponse = await response.json();
  setStaffTokens(data.accessToken, data.refreshToken, data.expiresAt);
  setStaffUser(data.staff);
  return data;
}

/**
 * Refresh staff access token
 */
export async function refreshStaffToken(): Promise<boolean> {
  const refreshToken = getStaffRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch("/api/auth/staff/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearStaffTokens();
      }
      return false;
    }

    const data = await response.json();
    setStaffTokens(data.accessToken, data.refreshToken, data.expiresAt);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current staff access token, refreshing if within 5 min of expiry
 */
export async function getStaffAccessToken(): Promise<string | null> {
  const token = localStorage.getItem(STAFF_ACCESS_TOKEN_KEY);
  const expiry = localStorage.getItem(STAFF_TOKEN_EXPIRY_KEY);

  if (!token) return null;

  if (expiry) {
    const expiryDate = new Date(expiry);
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;

    if (expiryDate.getTime() - now.getTime() < fiveMinutes) {
      const refreshed = await refreshStaffToken();
      if (!refreshed) return null;
      return localStorage.getItem(STAFF_ACCESS_TOKEN_KEY);
    }
  }

  return token;
}

export function getStaffRefreshToken(): string | null {
  return localStorage.getItem(STAFF_REFRESH_TOKEN_KEY);
}

export function setStaffTokens(
  accessToken: string,
  refreshToken: string,
  expiresAt: string
): void {
  localStorage.setItem(STAFF_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(STAFF_REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(STAFF_TOKEN_EXPIRY_KEY, expiresAt);
}

export function clearStaffTokens(): void {
  localStorage.removeItem(STAFF_ACCESS_TOKEN_KEY);
  localStorage.removeItem(STAFF_REFRESH_TOKEN_KEY);
  localStorage.removeItem(STAFF_TOKEN_EXPIRY_KEY);
  localStorage.removeItem(STAFF_USER_KEY);
  // Also clear legacy session key
  localStorage.removeItem("rcf_user");
}

export function getStaffUser(): StaffUser | null {
  const userStr = localStorage.getItem(STAFF_USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setStaffUser(user: StaffUser): void {
  localStorage.setItem(STAFF_USER_KEY, JSON.stringify(user));
  // Also set legacy key for backward compat with existing layout
  localStorage.setItem(
    "rcf_user",
    JSON.stringify({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role === "superadmin" ? "super-admin" : "admin",
    })
  );
}

export function isStaffLoggedIn(): boolean {
  return !!localStorage.getItem(STAFF_ACCESS_TOKEN_KEY);
}

export function staffLogout(): void {
  clearStaffTokens();
}

/**
 * Fetch with staff authentication (auto-refreshes token)
 */
export async function fetchWithStaffAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getStaffAccessToken();
  if (!token) throw new Error("Not authenticated");

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, { ...options, headers });
}
