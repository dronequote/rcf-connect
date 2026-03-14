import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/auth-utils";

export async function GET(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const statsDoc = await db
    .collection("rcfSettings")
    .findOne({ key: "dashboardStats" });

  return NextResponse.json(statsDoc?.value || {});
}

export async function PUT(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updates = await request.json();

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const setFields: Record<string, any> = {};
  for (const [key, value] of Object.entries(updates)) {
    setFields[`value.${key}`] = value;
  }

  await db.collection("rcfSettings").updateOne(
    { key: "dashboardStats" },
    { $set: setFields }
  );

  return NextResponse.json({ success: true });
}
