"use client";

import { useState } from "react";
import { Card, Section } from "@/components/ui";
import type { EventsData } from "@/lib/types";

interface EventsClientProps {
  events: EventsData;
}

export default function EventsClient({ events }: EventsClientProps) {
  const [rsvps, setRsvps] = useState<Record<string, boolean>>({});

  const toggleRsvp = (name: string) =>
    setRsvps((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="max-w-[460px] mx-auto p-5">
      <div className="bg-gradient-to-br from-church-main to-church-light -mx-5 -mt-5 px-5 pt-5 pb-7 rounded-b-3xl mb-6">
        <h1 className="font-serif text-white text-2xl mb-1">Events</h1>
        <p className="text-white/70 text-xs">RSVP and stay in the loop</p>
      </div>

      {/* This Summer */}
      <Section label="THIS SUMMER">
        {events.summer.map((e) => (
          <Card key={e.name} className="mb-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl shrink-0">
                🏊
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-gray-900">{e.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{e.time}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{e.desc}</p>
              </div>
            </div>
            <button
              onClick={() => toggleRsvp(e.name)}
              className={`w-full mt-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                rsvps[e.name]
                  ? "bg-church-main text-white"
                  : "bg-church-soft text-church-main"
              }`}
            >
              {rsvps[e.name] ? "✓ Going" : "RSVP — I'm In!"}
            </button>
          </Card>
        ))}
      </Section>

      {/* Upcoming */}
      <Section label="COMING UP">
        {events.upcoming.map((e) => (
          <Card key={e.name} className="mb-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-gray-900">{e.name}</h3>
                <p className="text-xs text-gray-500">{e.time}</p>
                <p className="text-xs text-gray-600 mt-0.5">{e.desc}</p>
              </div>
              <button
                onClick={() => toggleRsvp(e.name)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  rsvps[e.name]
                    ? "bg-church-main text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {rsvps[e.name] ? "✓ Going" : "RSVP"}
              </button>
            </div>
          </Card>
        ))}
      </Section>

      {/* Weekly Schedule */}
      <Section label="WEEKLY SCHEDULE">
        {events.weekly.map((e, i) => (
          <div
            key={`${e.day}-${i}`}
            className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
          >
            <div className="w-10 h-10 rounded-lg bg-church-soft flex items-center justify-center">
              <span className="text-[10px] font-bold text-church-main uppercase">{e.day}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{e.name}</p>
              <p className="text-xs text-gray-500">{e.time}</p>
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
}
