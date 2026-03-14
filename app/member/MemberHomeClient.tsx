"use client";

import Link from "next/link";
import { Card, Section } from "@/components/ui";
import type { ChurchInfo, Member, Sermon, DashboardStats, EventsData } from "@/lib/types";

interface MemberHomeProps {
  church: ChurchInfo;
  member: Member;
  sermons: Sermon[];
  stats: DashboardStats;
  events: EventsData;
}

export default function MemberHomeClient({ church, member, sermons, stats, events }: MemberHomeProps) {
  const latestSermon = sermons[0];
  const pct = Math.round((stats.mealsServed / stats.mealsGoal) * 100);

  return (
    <div className="max-w-[460px] mx-auto p-5">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-church-main to-church-light -mx-5 -mt-5 px-5 pt-6 pb-8 rounded-b-3xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-xs font-medium">Good morning,</p>
            <h1 className="font-serif text-white text-2xl">{member.firstName}</h1>
          </div>
          <Link
            href="/member/profile"
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold no-underline"
          >
            {member.avatar}
          </Link>
        </div>
        <p className="text-white/60 text-xs italic leading-relaxed">
          {church.featuredVerse}
        </p>
      </div>

      {/* Facebook Check-In */}
      <Card className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center text-white text-lg shrink-0">
            f
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900">You&apos;re at The River!</p>
            <p className="text-xs text-gray-500">Check in on Facebook</p>
          </div>
          <a
            href={church.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-[#1877F2] text-white text-xs font-semibold no-underline"
          >
            Check In
          </a>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          {stats.fbCheckinsToday} people checked in today
        </p>
      </Card>

      {/* This Sunday */}
      <Section label="THIS SUNDAY">
        <Card className="mb-3">
          <p className="text-xs text-gray-400 mb-1">{latestSermon.date}</p>
          <h3 className="font-serif text-lg text-church-main mb-1">
            {latestSermon.title}
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            {latestSermon.speaker} · {latestSermon.duration} · {latestSermon.verse}
          </p>
          <div className="flex gap-2">
            <Link
              href="/member/sermon"
              className="flex-1 py-2.5 rounded-lg bg-church-soft text-church-main text-xs font-semibold text-center no-underline"
            >
              View Sermon Notes
            </Link>
            <a
              href={latestSermon.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold text-center no-underline"
            >
              Watch on YouTube
            </a>
          </div>
        </Card>
      </Section>

      {/* Quick Actions */}
      <Section label="QUICK ACTIONS">
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {[
            { href: "/member/give", icon: "🎁", label: "Give" },
            { href: "/member/prayer", icon: "🙏", label: "Prayer" },
            { href: "/member/events", icon: "📅", label: "Events" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-sm no-underline hover:border-church-main transition-colors"
            >
              <div className="text-2xl mb-1">{a.icon}</div>
              <div className="text-xs font-semibold text-gray-700">{a.label}</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Upcoming Events */}
      <Section label="COMING UP">
        {events.upcoming.slice(0, 2).map((e) => (
          <Card key={e.name} className="mb-2.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-church-soft flex items-center justify-center text-lg shrink-0">
              📅
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{e.name}</p>
              <p className="text-xs text-gray-500">{e.time}</p>
            </div>
            <Link
              href="/member/events"
              className="text-xs text-church-main font-semibold no-underline"
            >
              RSVP →
            </Link>
          </Card>
        ))}
      </Section>

      {/* Agape Meals Progress */}
      <Section label="AGAPE MEALS">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-900">Meals Served in 2026</p>
            <p className="text-xs text-church-main font-bold">{stats.mealsServed.toLocaleString()}</p>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1">
            <div
              className="h-full bg-gradient-to-r from-church-main to-church-light rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 text-right">
            Goal: {stats.mealsGoal.toLocaleString()}
          </p>
        </Card>
      </Section>

      {/* Kids Check-in */}
      <Section label="KIDS CHECK-IN">
        <Card>
          <p className="text-xs text-gray-500 mb-3">Your children</p>
          {member.family.members
            .filter((m) => "age" in m)
            .map((child) => (
              <div key={child.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{child.name}</p>
                  <p className="text-xs text-gray-500">
                    {"grade" in child ? child.grade : ""} · {"room" in child ? child.room : ""}
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-church-soft text-church-main text-xs font-semibold">
                  Check In
                </button>
              </div>
            ))}
        </Card>
      </Section>

      {/* Invite Link */}
      <Card className="mb-4 text-center">
        <p className="text-sm font-semibold text-gray-900 mb-1">Invite Someone to The River</p>
        <p className="text-xs text-gray-500 mb-3">Share your personal invite link</p>
        <button
          onClick={() => navigator.clipboard?.writeText(`${typeof window !== "undefined" ? window.location.origin : ""}/connect?ref=${member.firstName.toLowerCase()}`)}
          className="px-4 py-2.5 rounded-lg bg-church-main text-white text-xs font-semibold w-full"
        >
          Copy Invite Link
        </button>
      </Card>
    </div>
  );
}
