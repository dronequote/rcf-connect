"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Section, Btn } from "@/components/ui";
import StaffHelp from "@/components/StaffHelp";
import { fetchWithStaffAuth } from "@/lib/staff-auth";
import type { Sermon } from "@/lib/types";

interface AiToolsClientProps {
  sermons: Sermon[];
}

const pipelineSteps = [
  "Transcribing audio",
  "Identifying scripture references",
  "Generating sermon summary",
  "Creating discussion questions",
  "Writing devotional prompts",
  "Creating kids version",
  "Generating social media quotes",
];

const outputCards = [
  { id: "summary", icon: "📝", label: "Summary", desc: "Structured overview with key themes" },
  { id: "questions", icon: "❓", label: "Discussion Questions", desc: "5 questions for small groups" },
  { id: "devotionals", icon: "📖", label: "Devotionals", desc: "Mon-Fri daily prompts" },
  { id: "kids", icon: "🧒", label: "Kids Version", desc: "Age-appropriate retelling" },
  { id: "social", icon: "📱", label: "Social Posts", desc: "Shareable quote graphics" },
  { id: "transcript", icon: "📄", label: "Full Transcript", desc: "Complete sermon text" },
];

const autoDistribute = [
  { id: "member", label: "Member Portal → Sermon Notes" },
  { id: "website", label: "Website → Teaching Archive" },
  { id: "bulletin", label: "Weekly Bulletin → Summary & verse" },
  { id: "facebook", label: "Facebook → Auto-post quote" },
  { id: "email", label: "Email → Weekly digest to members" },
];

export default function AiToolsClient({ sermons }: AiToolsClientProps) {
  const [mode, setMode] = useState<"upload" | "processing" | "done">("upload");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);
  const [distributions, setDistributions] = useState<Record<string, boolean>>({
    member: true,
    website: true,
    bulletin: true,
    facebook: false,
    email: false,
  });
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startProcessing = () => {
    setMode("processing");
    setCurrentStep(0);
  };

  useEffect(() => {
    if (mode === "processing" && currentStep < pipelineSteps.length) {
      timerRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 800 + Math.random() * 600);
    } else if (mode === "processing" && currentStep >= pipelineSteps.length) {
      setMode("done");
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [mode, currentStep]);

  const sermon = sermons[0];

  const handlePublish = async () => {
    if (!sermon) return;
    setPublishing(true);
    try {
      const res = await fetchWithStaffAuth(`/api/admin/sermons/${sermon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: true }),
      });
      if (res.ok) {
        setPublished(true);
      }
    } catch (err) {
      console.error("Failed to publish sermon:", err);
    }
    setPublishing(false);
  };

  return (
    <div className="p-5 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-gray-900">AI Sermon Tools</h1>
        <p className="text-sm text-gray-500">
          Upload a sermon → get summary, questions, devotionals, kids version &amp; social posts
        </p>
      </div>

      <StaffHelp section="ai" />

      {mode === "upload" && (
        <>
          {/* Upload Section */}
          <Section label="UPLOAD SERMON">
            <Card className="mb-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4 hover:border-church-main transition-colors cursor-pointer">
                <div className="text-4xl mb-2">🎙️</div>
                <p className="text-sm font-semibold text-gray-700">
                  Drop audio file here or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">MP3, WAV, M4A (max 500MB)</p>
              </div>
              <div className="text-center text-xs text-gray-400 mb-3">— or —</div>
              <input
                type="text"
                placeholder="Paste YouTube URL..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-church-main transition-colors"
              />
            </Card>
          </Section>

          {/* Recent YouTube */}
          <Section label="RECENT YOUTUBE UPLOADS">
            <div className="space-y-2 mb-5">
              {sermons.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setYoutubeUrl(s.youtubeUrl)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 text-left hover:border-church-main transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 text-sm shrink-0">
                    ▶
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.date} · {s.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          <Btn full onClick={startProcessing}>
            🤖 Process Sermon with AI
          </Btn>
        </>
      )}

      {mode === "processing" && (
        <Card className="mb-5">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2 animate-pulse">🤖</div>
            <h2 className="font-serif text-xl text-church-main">Processing Sermon...</h2>
            <p className="text-xs text-gray-500 mt-1">This usually takes 2-3 minutes</p>
          </div>
          <div className="space-y-3">
            {pipelineSteps.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 transition-all ${
                    i < currentStep
                      ? "bg-church-main text-white"
                      : i === currentStep
                      ? "bg-church-soft text-church-main animate-pulse"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <p
                  className={`text-sm ${
                    i < currentStep
                      ? "text-church-main font-semibold"
                      : i === currentStep
                      ? "text-gray-900 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {mode === "done" && (
        <>
          <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200">
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <p className="text-sm font-semibold text-green-800">
                {published ? "Sermon published!" : "Sermon processed successfully!"}
              </p>
            </div>
            <p className="text-xs text-green-700 mt-1">
              &ldquo;{sermon.title}&rdquo; — all 6 outputs generated
              {published && " and published to member portal"}
            </p>
          </div>

          {/* Output Cards */}
          <Section label="GENERATED CONTENT">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-5">
              {outputCards.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOutput(selectedOutput === o.id ? null : o.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedOutput === o.id
                      ? "border-church-main bg-church-soft"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">{o.icon}</div>
                  <p className="text-xs font-semibold text-gray-900">{o.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{o.desc}</p>
                </button>
              ))}
            </div>
          </Section>

          {/* Preview Pane */}
          {selectedOutput === "summary" && (
            <Section label="PREVIEW: SUMMARY">
              <Card className="mb-5">
                <h3 className="font-serif text-lg text-church-main mb-2">{sermon.title}</h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {sermon.summary.themes.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-church-soft text-church-main text-[10px] font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{sermon.summary.mainMessage}</p>
                <div className="flex gap-2">
                  <button
                    onClick={handlePublish}
                    disabled={publishing || published}
                    className="px-3 py-1.5 rounded-lg bg-church-main text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {published ? "Published" : publishing ? "Publishing..." : "Publish to Website"}
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">
                    Edit
                  </button>
                </div>
              </Card>
            </Section>
          )}

          {selectedOutput === "questions" && (
            <Section label="PREVIEW: DISCUSSION QUESTIONS">
              <Card className="mb-5">
                {sermon.questions.map((q, i) => (
                  <p key={i} className="text-sm text-gray-700 py-2 border-b border-gray-100 last:border-0">
                    {i + 1}. {q}
                  </p>
                ))}
              </Card>
            </Section>
          )}

          {/* Auto-Distribute */}
          <Section label="AUTO-DISTRIBUTE">
            <Card className="mb-5">
              {autoDistribute.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <p className="text-xs text-gray-700">{d.label}</p>
                  <button
                    onClick={() => setDistributions((prev) => ({ ...prev, [d.id]: !prev[d.id] }))}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      distributions[d.id] ? "bg-church-main" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        distributions[d.id] ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </Card>
          </Section>

          <div className="flex gap-3">
            <Btn full onClick={handlePublish} disabled={publishing || published}>
              {published ? "Published" : publishing ? "Publishing..." : "Publish All"}
            </Btn>
            <Btn variant="outline" onClick={() => { setMode("upload"); setSelectedOutput(null); setPublished(false); }}>
              Process Another
            </Btn>
          </div>
        </>
      )}
    </div>
  );
}
