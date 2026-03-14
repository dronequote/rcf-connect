"use client";

import { Card, Section } from "@/components/ui";
import StaffHelp from "@/components/StaffHelp";
import type { DashboardStats } from "@/lib/types";

interface SocialClientProps {
  stats: DashboardStats;
}

const weeklyCheckinsBase = [
  { week: "Feb 2", count: 8 },
  { week: "Feb 9", count: 12 },
  { week: "Feb 16", count: 10 },
  { week: "Feb 23", count: 15 },
  { week: "Mar 2", count: 14 },
];

const contentIdeas = [
  { type: "Photo", idea: "Sunday worship moments — capture hands raised during praise", day: "Sunday" },
  { type: "Story", idea: "Agape Meal prep behind the scenes", day: "Wednesday" },
  { type: "Reel", idea: "Kids ministry highlights — 30s of smiles and crafts", day: "Thursday" },
  { type: "Post", idea: "Church at the Lake announcement with swimming photos", day: "Friday" },
];

export default function SocialClient({ stats }: SocialClientProps) {
  const weeklyCheckins = [
    ...weeklyCheckinsBase,
    { week: "Mar 9", count: stats.fbCheckinsToday },
  ];

  const maxCheckin = Math.max(...weeklyCheckins.map((w) => w.count));

  return (
    <div className="p-5 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-gray-900">Social Media</h1>
        <p className="text-sm text-gray-500">Facebook engagement &amp; content planning</p>
      </div>

      <StaffHelp section="social" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="text-center">
          <p className="text-3xl font-bold text-[#1877F2]">{stats.fbCheckinsToday}</p>
          <p className="text-xs text-gray-500">Check-ins Today</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-[#1877F2]">{stats.fbPageLikes}</p>
          <p className="text-xs text-gray-500">Page Likes</p>
        </Card>
      </div>

      {/* Check-in Script */}
      <Section label="SUNDAY CHECK-IN SCRIPT">
        <Card className="mb-5 border-l-4 border-church-main">
          <p className="text-xs text-gray-400 font-bold mb-2">SUGGESTED IN-SERVICE PROMPT</p>
          <p className="text-sm text-gray-700 leading-relaxed italic">
            &ldquo;Hey everyone — take a second right now and pull out your phone. Check in at The River Christian Fellowship on Facebook. Let your friends see where you are. Then invite 3 people to like our page. You might be the reason someone walks through these doors next Sunday.&rdquo;
          </p>
        </Card>
      </Section>

      {/* Weekly Check-in Trend */}
      <Section label="WEEKLY CHECK-IN TREND">
        <Card className="mb-5">
          <div className="flex items-end gap-2 h-32">
            {weeklyCheckins.map((w) => (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500 font-semibold">{w.count}</span>
                <div
                  className="w-full bg-gradient-to-t from-[#1877F2] to-[#42a5f5] rounded-t-md transition-all"
                  style={{ height: `${(w.count / maxCheckin) * 80}px` }}
                />
                <span className="text-[9px] text-gray-400">{w.week}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* Content Calendar Ideas */}
      <Section label="CONTENT IDEAS THIS WEEK">
        <div className="space-y-2 mb-5">
          {contentIdeas.map((c) => (
            <Card key={c.type} className="flex items-start gap-3">
              <div className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 ${
                c.type === "Photo" ? "bg-purple-100 text-purple-700"
                : c.type === "Story" ? "bg-pink-100 text-pink-700"
                : c.type === "Reel" ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
              }`}>
                {c.type}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{c.idea}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{c.day}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Growth Tips */}
      <Section label="GROWTH STRATEGY">
        <Card>
          <div className="space-y-3">
            {[
              "Ask congregation to check in every Sunday (use the script above)",
              "Post 3x per week: 1 photo, 1 story, 1 announcement",
              "Share Agape Meals impact — people love seeing real numbers",
              "Feature member testimonies (with permission) monthly",
              "Cross-post Church at the Lake content to Instagram Reels",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-church-soft flex items-center justify-center text-church-main text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
}
