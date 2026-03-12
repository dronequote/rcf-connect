import { NextRequest, NextResponse } from "next/server";

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";
const LOCATION_ID = process.env.GHL_LOCATION_ID || "";
const GHL_PIT = process.env.GHL_PIT || "";

const ghlHeaders = {
  Authorization: `Bearer ${GHL_PIT}`,
  Version: GHL_VERSION,
  "Content-Type": "application/json",
  Accept: "application/json",
};

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

    if (!LOCATION_ID || !GHL_PIT) {
      console.log("Missing GHL config. Data:", JSON.stringify(body, null, 2));
      return NextResponse.json({ success: true });
    }

    // Build tags
    const tags: string[] = ["RCF Website"];
    if (formTag) tags.push(formTag);
    if (interests.length > 0) tags.push(...interests);

    // Step 1: Search for existing contact by email
    const searchRes = await fetch(
      `${GHL_BASE}/contacts/?locationId=${LOCATION_ID}&query=${encodeURIComponent(email)}&limit=1`,
      { headers: ghlHeaders }
    );

    let contactId: string | null = null;
    let isExisting = false;

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const existing = searchData.contacts?.[0];

      if (existing && existing.email?.toLowerCase() === email.toLowerCase()) {
        // Step 2a: Existing contact — merge tags
        contactId = existing.id;
        isExisting = true;

        const existingTags: string[] = existing.tags || [];
        const mergedTags = [...new Set([...existingTags, ...tags])];

        const updateRes = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
          method: "PUT",
          headers: ghlHeaders,
          body: JSON.stringify({
            tags: mergedTags,
          }),
        });

        if (updateRes.ok) {
          console.log(
            `Updated existing contact ${contactId}: merged tags [${mergedTags.join(", ")}]`
          );
        } else {
          const errText = await updateRes.text();
          console.error(`GHL update failed (${updateRes.status}):`, errText);
        }
      }
    }

    if (!isExisting) {
      // Step 2b: New contact — create via GHL
      const createRes = await fetch(`${GHL_BASE}/contacts/`, {
        method: "POST",
        headers: ghlHeaders,
        body: JSON.stringify({
          locationId: LOCATION_ID,
          firstName,
          lastName: lastName || "",
          email,
          phone: phone || "",
          tags,
          source: `RCF Website - ${formTag || "General"}`,
        }),
      });

      if (createRes.ok) {
        const createData = await createRes.json();
        contactId = createData.contact?.id;
        console.log(`Created new contact ${contactId}`);
      } else {
        const errText = await createRes.text();
        console.error("GHL create failed:", errText);
      }
    }

    // Step 3: Add activity note so it shows up in the contact timeline
    if (contactId) {
      const noteLines = [
        `📋 Form: ${formTag || "General"}`,
        `Source: ${source}`,
        interests.length > 0 ? `Interests: ${interests.join(", ")}` : null,
        isExisting ? `(Returning visitor — tags merged)` : `(New visitor)`,
      ]
        .filter(Boolean)
        .join("\n");

      fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
        method: "POST",
        headers: ghlHeaders,
        body: JSON.stringify({ body: noteLines }),
      }).catch((err) =>
        console.error("Note failed (non-blocking):", err)
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ success: true }); // Don't fail the user
  }
}
