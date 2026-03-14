import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/auth-utils";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const { _id, ...updates } = body;
  updates.updatedAt = new Date().toISOString();

  const result = await db.collection("rcfSermons").updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Sermon not found" }, { status: 404 });
  }

  revalidatePath("/member/sermon");

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const result = await db.collection("rcfSermons").deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Sermon not found" }, { status: 404 });
  }

  revalidatePath("/member/sermon");

  return NextResponse.json({ success: true });
}
