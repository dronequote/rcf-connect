import { NextResponse } from "next/server";
import { requireStaffAuth } from "@/lib/auth-utils";
import { fulfillRedemption } from "@/lib/ambassador";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const result = await fulfillRedemption(id, body.adminNote);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
