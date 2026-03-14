import { NextRequest, NextResponse } from "next/server";
import { refreshStaffTokens } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 });
    }
    const result = await refreshStaffTokens(refreshToken);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Invalid refresh token" },
      { status: 401 }
    );
  }
}
