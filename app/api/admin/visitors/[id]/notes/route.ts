import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/auth-utils";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { text } = await request.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "Note text required" }, { status: 400 });
  }

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const note = {
    text: text.trim(),
    author: staff.email,
    createdAt: new Date().toISOString(),
  };

  const result = await db.collection("rcfCheckins").updateOne(
    { _id: new ObjectId(id) },
    { $push: { notes: note } as any }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Visitor not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, note });
}
