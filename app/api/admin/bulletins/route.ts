import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/auth-utils";

export async function GET(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const bulletins = await db
    .collection("rcfBulletins")
    .find({})
    .sort({ weekOf: -1 })
    .toArray();

  return NextResponse.json(
    bulletins.map((b) => ({
      id: b._id.toString(),
      weekOf: b.weekOf,
      sermonTitle: b.sermonTitle,
      speaker: b.speaker,
      verse: b.verse,
      announcement: b.announcement,
      featuredEvents: b.featuredEvents || [],
      published: b.published || false,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }))
  );
}

export async function POST(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    weekOf,
    sermonTitle,
    speaker,
    verse,
    announcement,
    featuredEvents,
  } = body;

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const now = new Date().toISOString();
  const bulletin = {
    weekOf: weekOf || now,
    sermonTitle: sermonTitle || "",
    speaker: speaker || "",
    verse: verse || "",
    announcement: announcement || "",
    featuredEvents: featuredEvents || [],
    published: false,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("rcfBulletins").insertOne(bulletin);

  return NextResponse.json({
    success: true,
    id: result.insertedId.toString(),
    bulletin: { ...bulletin, id: result.insertedId.toString() },
  });
}
