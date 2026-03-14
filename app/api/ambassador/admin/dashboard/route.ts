import { NextResponse } from "next/server";
import { requireStaffAuth } from "@/lib/auth-utils";
import { getAdminDashboard } from "@/lib/ambassador";

export async function GET(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const dashboard = await getAdminDashboard();
    return NextResponse.json(dashboard);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
