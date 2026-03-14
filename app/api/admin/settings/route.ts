import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/auth-utils";

export async function GET(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const settings = await db.collection("rcfSettings").find({}).toArray();
  const result: Record<string, any> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }

  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  for (const [key, value] of Object.entries(body)) {
    await db.collection("rcfSettings").updateOne(
      { key },
      { $set: { key, value, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }

  revalidatePath("/");
  revalidatePath("/connect");

  return NextResponse.json({ success: true });
}
