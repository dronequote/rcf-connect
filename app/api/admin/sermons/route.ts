import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/auth-utils";

export async function GET(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const sermons = await db
    .collection("rcfSermons")
    .find({})
    .sort({ date: -1 })
    .toArray();

  const mapped = sermons.map((s) => ({
    id: s._id.toString(),
    title: s.title,
    speaker: s.speaker,
    date: s.date,
    duration: s.duration,
    verse: s.verse,
    youtubeUrl: s.youtubeUrl || "",
    summary: s.summary || null,
    questions: s.questions || [],
    devotionals: s.devotionals || [],
    kidsVersion: s.kidsVersion || "",
    quote: s.quote || "",
    published: s.published !== false,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));

  return NextResponse.json(mapped);
}

export async function POST(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, speaker, date, duration, verse, youtubeUrl } = body;

  if (!title || !speaker || !date) {
    return NextResponse.json({ error: "Title, speaker, and date required" }, { status: 400 });
  }

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const now = new Date().toISOString();
  const sermon = {
    title,
    speaker,
    date,
    duration: duration || "",
    verse: verse || "",
    youtubeUrl: youtubeUrl || "",
    summary: null,
    questions: [],
    devotionals: [],
    kidsVersion: "",
    quote: "",
    published: false,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("rcfSermons").insertOne(sermon);

  revalidatePath("/member/sermon");

  return NextResponse.json({
    success: true,
    id: result.insertedId.toString(),
    sermon: { ...sermon, id: result.insertedId.toString() },
  });
}
