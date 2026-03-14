import { NextRequest, NextResponse } from "next/server";
import { verifyMemberMagicLink } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }
    const result = await verifyMemberMagicLink(token);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Invalid or expired link" },
      { status: 401 }
    );
  }
}
