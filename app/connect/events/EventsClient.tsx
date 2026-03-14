"use client";

import { useRouter } from "next/navigation";
import { Header, Section, Card, Btn } from "@/components/ui";
import type { EventsData } from "@/lib/types";

export default function EventsClient({ events }: { events: EventsData }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-warm">
      <div className="max-w-[460px] mx-auto p-5">
        <Header
          title="What's Happening"
          subtitle="Find your rhythm at The River"
          onBack={() => router.push("/")}
        />

        <Section label="THIS SUMMER">
          {events.summer.map((e, i) => (
            <Card
              key={i}
              className="!bg-gradient-to-br !from-church-main !to-church-light !border-none mb-2.5"
            >
              <div className="font-bold text-[17px] text-white mb-1">
                {e.name}
              </div>
              <div className="text-[13px] text-gold font-semibold mb-1">
                {e.time}
              </div>
              <div className="text-xs text-white/70">{e.desc}</div>
            </Card>
          ))}
        </Section>

        <Section label="COMING UP">
          {events.upcoming.map((e, i) => (
            <Card
              key={i}
              className={`mb-2.5 !p-4 ${
                e.highlight
                  ? "border-l-4 !border-l-gold"
                  : "border-l-4 !border-l-gray-200"
              }`}
            >
              <div className="font-semibold text-sm text-gray-900">
                {e.name}
              </div>
              <div
                className={`text-xs font-semibold my-0.5 ${
                  e.highlight ? "text-gold" : "text-gray-400"
                }`}
              >
                {e.time}
              </div>
              <div className="text-xs text-gray-500">{e.desc}</div>
            </Card>
          ))}
        </Section>

        <Section label="WEEKLY SCHEDULE">
          {events.weekly.map((e, i) => (
            <div
              key={i}
              className={`flex gap-3 py-3 ${
                i < events.weekly.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
            >
              <div className="w-11 text-[11px] font-bold text-church-main pt-0.5">
                {e.day}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-gray-900">
                  {e.name}
                </div>
                <div className="text-[11px] text-gray-400">
                  {e.time} · {e.desc}
                </div>
              </div>
            </div>
          ))}
        </Section>

        <Btn onClick={() => router.push("/connect/new")} full>
          Stay in the loop? Connect with us →
        </Btn>
      </div>
    </div>
  );
}
