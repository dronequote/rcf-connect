import { NextResponse } from "next/server";
import { requireStaffAuth } from "@/lib/auth-utils";
import { getRedemptions } from "@/lib/ambassador";

export async function GET(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;

    const redemptions = await getRedemptions(status);
    return NextResponse.json(redemptions);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
