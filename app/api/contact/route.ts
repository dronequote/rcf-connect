import { NextRequest, NextResponse } from "next/server";

const NESTJS_API = "https://api.leadprospecting.ai";
const LOCATION_ID = process.env.GHL_LOCATION_ID || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      interests = [],
      formTag,
      source = "Website",
    } = body;

    if (!firstName || !email) {
      return NextResponse.json(
        { error: "First name and email are required" },
        { status: 400 }
      );
    }

    // Build tags array
    const tags: string[] = ["RCF Website"];
    if (formTag) tags.push(formTag);
    if (interests.length > 0) tags.push(...interests);

    // Push to NestJS → GHL
    const payload = {
      locationId: LOCATION_ID,
      firstName,
      lastName: lastName || "",
      email,
      phone: phone || "",
      tags,
      source: `RCF Website - ${formTag || "General"}`,
      customFields: [
        {
          key: "how_they_connected",
          value: source,
        },
      ],
    };

    // Only call NestJS if we have a location ID configured
    if (LOCATION_ID) {
      const response = await fetch(`${NESTJS_API}/api/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("NestJS API error:", data);
        // Still return success to user - don't block their experience
      }
    } else {
      console.log(
        "No GHL_LOCATION_ID configured. Contact data:",
        JSON.stringify(payload, null, 2)
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ success: true }); // Don't fail the user
  }
}
