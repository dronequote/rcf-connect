import { NextResponse } from "next/server";
import { trackClick } from "@/lib/ambassador";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ambassadorSlug, sessionId, path, destination } = body;

    if (!ambassadorSlug) {
      return NextResponse.json({ error: "ambassadorSlug is required" }, { status: 400 });
    }

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";

    const result = await trackClick({
      ambassadorSlug,
      sessionId,
      ipAddress,
      userAgent,
      referer,
      path,
      destination,
    });

    if (!result.success && result.error === "Invalid ambassador") {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
