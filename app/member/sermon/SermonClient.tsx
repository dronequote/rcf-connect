"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Section } from "@/components/ui";
import type { Sermon } from "@/lib/types";

interface SermonClientProps {
  sermons: Sermon[];
}

const contentTabs = ["Summary", "Questions", "Devotionals", "Kids"] as const;
type Tab = (typeof contentTabs)[number];

export default function SermonClient({ sermons }: SermonClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Summary");
  const [selectedSermon, setSelectedSermon] = useState(0);
  const sermon = sermons[selectedSermon];

  return (
    <div className="max-w-[460px] mx-auto p-5">
      {/* Header */}
      <div className="bg-gradient-to-br from-church-main to-church-light -mx-5 -mt-5 px-5 pt-5 pb-7 rounded-b-3xl mb-6">
        <h1 className="font-serif text-white text-2xl mb-1">Sermon Notes</h1>
        <p className="text-white/70 text-xs">AI-powered insights from this week&apos;s teaching</p>
      </div>

      {/* Current Sermon Card */}
      <Card className="mb-5">
        <p className="text-xs text-gray-400 mb-1">{sermon.date}</p>
        <h2 className="font-serif text-xl text-church-main mb-1">{sermon.title}</h2>
        <p className="text-xs text-gray-500 mb-3">
          {sermon.speaker} · {sermon.duration} · {sermon.verse}
        </p>
        <div className="flex gap-2">
          <a
            href={sermon.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold text-center no-underline"
          >
            ▶ Watch on YouTube
          </a>
        </div>
      </Card>

      {/* Content Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1">
        {contentTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab
                ? "bg-white text-church-main shadow-sm"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Summary" && (
        <div className="animate-fade-up">
          <Section label="KEY THEMES">
            <div className="flex flex-wrap gap-2 mb-4">
              {sermon.summary.themes.map((theme) => (
                <span
                  key={theme}
                  className="px-3 py-1.5 rounded-full bg-church-soft text-church-main text-xs font-semibold"
                >
                  {theme}
                </span>
              ))}
            </div>
          </Section>
          <Section label="MAIN MESSAGE">
            <Card className="mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {sermon.summary.mainMessage}
              </p>
            </Card>
          </Section>
          <Section label="KEY SCRIPTURES">
            <div className="space-y-1.5">
              {sermon.summary.scriptures.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200"
                >
                  <span className="text-church-main text-sm">📖</span>
                  <span className="text-sm text-gray-700">{s}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === "Questions" && (
        <div className="animate-fade-up">
          <Section label="DISCUSSION QUESTIONS">
            <p className="text-xs text-gray-500 mb-3">
              For small groups &amp; Bible studies
            </p>
            <div className="space-y-2.5">
              {sermon.questions.map((q, i) => (
                <Card key={i}>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-church-soft flex items-center justify-center text-church-main text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{q}</p>
                  </div>
                </Card>
              ))}
              {sermon.questions.length === 0 && (
                <Card>
                  <p className="text-sm text-gray-400 text-center py-4">
                    Discussion questions not yet available for this sermon.
                  </p>
                </Card>
              )}
            </div>
          </Section>
        </div>
      )}

      {activeTab === "Devotionals" && (
        <div className="animate-fade-up">
          <Section label="DAILY DEVOTIONALS">
            <p className="text-xs text-gray-500 mb-3">
              Monday – Friday, tied to this week&apos;s teaching
            </p>
            <div className="space-y-2.5">
              {sermon.devotionals.map((d) => (
                <Card key={d.day}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-gold/20 text-gold text-[10px] font-bold uppercase">
                      {d.day}
                    </span>
                    <span className="text-xs text-gray-400">{d.scripture}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-1.5">{d.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{d.prompt}</p>
                </Card>
              ))}
              {sermon.devotionals.length === 0 && (
                <Card>
                  <p className="text-sm text-gray-400 text-center py-4">
                    Devotionals not yet available for this sermon.
                  </p>
                </Card>
              )}
            </div>
          </Section>
        </div>
      )}

      {activeTab === "Kids" && (
        <div className="animate-fade-up">
          <Section label="KIDS VERSION">
            <Card className="mb-4">
              <div className="text-center mb-3">
                <span className="text-4xl">🧒</span>
              </div>
              <h3 className="font-serif text-lg text-church-main text-center mb-3">
                {sermon.title}
              </h3>
              {sermon.kidsVersion ? (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {sermon.kidsVersion}
                </p>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  Kids version not yet available for this sermon.
                </p>
              )}
            </Card>
          </Section>
        </div>
      )}

      {/* Shareable Quote */}
      {sermon.quote && (
        <Section label="SHARE THIS">
          <Card className="bg-gradient-to-br from-church-main to-church-light text-white text-center">
            <p className="font-serif text-lg italic leading-relaxed mb-3">
              &ldquo;{sermon.quote}&rdquo;
            </p>
            <p className="text-white/70 text-xs mb-4">
              — {sermon.speaker}, {sermons[0].title}
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(`"${sermon.quote}" — ${sermon.speaker}`)}
              className="px-4 py-2 rounded-lg bg-white/20 text-white text-xs font-semibold"
            >
              Copy Quote
            </button>
          </Card>
        </Section>
      )}

      {/* Recent Sermons */}
      <Section label="RECENT SERMONS">
        {sermons.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              setSelectedSermon(i);
              setActiveTab("Summary");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`w-full text-left mb-2 p-3 rounded-xl border transition-all ${
              i === selectedSermon
                ? "border-church-main bg-church-soft"
                : "border-gray-200 bg-white"
            }`}
          >
            <p className="text-sm font-semibold text-gray-900">{s.title}</p>
            <p className="text-xs text-gray-500">
              {s.speaker} · {s.date}
            </p>
          </button>
        ))}
      </Section>
    </div>
  );
}
