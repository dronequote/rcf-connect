"use client";

import { useState } from "react";
import { Card, Section, Input, Btn } from "@/components/ui";
import StaffHelp from "@/components/StaffHelp";
import { fetchWithStaffAuth } from "@/lib/staff-auth";
import type { EventsData } from "@/lib/types";

interface BulletinClientProps {
  events: EventsData;
}

export default function BulletinClient({ events }: BulletinClientProps) {
  const [sermonTitle, setSermonTitle] = useState("Standing Firm in the Storm");
  const [speaker, setSpeaker] = useState("Tim Aulger");
  const [verse, setVerse] = useState("2 Timothy 4:17");
  const [announcement, setAnnouncement] = useState(
    "Welcome to The River! Agape Meals this Wednesday at 5:30 PM — bring the whole family."
  );
  const [enabledEvents, setEnabledEvents] = useState<Record<string, boolean>>({
    "Church at the Lake": true,
    "Easter at The River": true,
    "3-Day Retreat": true,
    "Easter Candy Drive": false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generated, setGenerated] = useState(false);

  const toggleEvent = (name: string) =>
    setEnabledEvents((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const featuredEvents = Object.entries(enabledEvents)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name);

      const res = await fetchWithStaffAuth("/api/admin/bulletins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekOf: new Date().toISOString(),
          sermonTitle,
          speaker,
          verse,
          announcement,
          featuredEvents,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save bulletin:", err);
    }
    setSaving(false);
  };

  const handleGenerate = async () => {
    await handleSave();
    setGenerated(true);
  };

  return (
    <div className="p-5 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-gray-900">Weekly Bulletin</h1>
        <p className="text-sm text-gray-500">
          Edit once — updates website, brochure, and landing page
        </p>
      </div>

      <StaffHelp section="bulletin" />

      {saved && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200">
          <p className="text-sm text-green-700 font-semibold">Bulletin saved successfully!</p>
        </div>
      )}

      {generated && (
        <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">✅</span>
            <p className="text-sm font-semibold text-green-800">Brochure Generated!</p>
          </div>
          <p className="text-xs text-green-700">
            PDF ready for print · Website updated · Landing page synced
          </p>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold">
              Download PDF
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white text-green-700 text-xs font-semibold border border-green-300">
              Email to Print Team
            </button>
          </div>
        </div>
      )}

      {/* Sermon Info */}
      <Section label="THIS WEEK'S SERMON">
        <Card className="mb-4 space-y-0">
          <Input label="Sermon Title" value={sermonTitle} onChange={setSermonTitle} />
          <div className="flex gap-2.5">
            <Input label="Speaker" value={speaker} onChange={setSpeaker} />
            <Input label="Featured Verse" value={verse} onChange={setVerse} />
          </div>
        </Card>
      </Section>

      {/* Announcement */}
      <Section label="MAIN ANNOUNCEMENT">
        <Card className="mb-4">
          <Input
            label="Announcement"
            value={announcement}
            onChange={setAnnouncement}
            multiline
          />
        </Card>
      </Section>

      {/* Featured Events */}
      <Section label="FEATURED EVENTS">
        <Card className="mb-4">
          <p className="text-xs text-gray-500 mb-3">
            Toggle which events appear on this week&apos;s materials
          </p>
          {[...events.summer, ...events.upcoming].map((e) => (
            <div
              key={e.name}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{e.name}</p>
                <p className="text-xs text-gray-500">{e.time}</p>
              </div>
              <button
                onClick={() => toggleEvent(e.name)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  enabledEvents[e.name] ? "bg-church-main" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                    enabledEvents[e.name] ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </Card>
      </Section>

      {/* Weekly Schedule Preview */}
      <Section label="SCHEDULE PREVIEW">
        <Card className="mb-5">
          {events.weekly.slice(0, 5).map((e, i) => (
            <div
              key={`${e.day}-${i}`}
              className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-[10px] font-bold text-church-main uppercase w-8">
                {e.day}
              </span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-900">{e.name}</p>
                <p className="text-[10px] text-gray-500">{e.time}</p>
              </div>
            </div>
          ))}
        </Card>
      </Section>

      {/* Actions */}
      <div className="flex gap-3">
        <Btn full onClick={handleGenerate} disabled={saving}>
          {saving ? "Saving..." : "Generate Brochure PDF"}
        </Btn>
        <Btn variant="outline" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Draft"}
        </Btn>
      </div>
    </div>
  );
}
