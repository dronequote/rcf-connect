import { NextResponse } from "next/server";
import { requireStaffAuth } from "@/lib/auth-utils";
import { updateAmbassadorStatus } from "@/lib/ambassador";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !["active", "suspended", "pending"].includes(status)) {
      return NextResponse.json({ error: "Valid status required (active, suspended, pending)" }, { status: 400 });
    }

    const result = await updateAmbassadorStatus(id, status);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
