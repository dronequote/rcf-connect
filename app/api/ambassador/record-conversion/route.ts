import { NextResponse } from "next/server";
import { recordConversion } from "@/lib/ambassador";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ambassadorEmail, visitorName, visitorEmail, visitorPhone, items, sessionId, attributionMethod, landingPath } = body;

    if (!ambassadorEmail || !visitorEmail || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "ambassadorEmail, visitorEmail, and items[] are required" },
        { status: 400 },
      );
    }

    const result = await recordConversion({
      ambassadorEmail,
      visitorName: visitorName || "",
      visitorEmail,
      visitorPhone,
      items,
      sessionId,
      attributionMethod,
      landingPath,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
