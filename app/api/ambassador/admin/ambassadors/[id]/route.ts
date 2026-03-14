import { NextResponse } from "next/server";
import { requireStaffAuth } from "@/lib/auth-utils";
import { deleteAmbassador } from "@/lib/ambassador";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const result = await deleteAmbassador(id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
