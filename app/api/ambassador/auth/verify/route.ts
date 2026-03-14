import { NextResponse } from "next/server";
import { verifyMagicLink } from "@/lib/ambassador";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "token is required" }, { status: 400 });
    }

    const result = await verifyMagicLink(token);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
