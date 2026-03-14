import { NextResponse } from "next/server";
import { requestMagicLink } from "@/lib/ambassador";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const result = await requestMagicLink(email);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
