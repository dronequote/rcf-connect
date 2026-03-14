"use client";

import { useState } from "react";
import { Card, Section, Btn } from "@/components/ui";
import type { ChurchInfo, GiveFund, GiveMethod, GivingRecord } from "@/lib/types";

interface GiveClientProps {
  church: ChurchInfo;
  funds: readonly GiveFund[];
  methods: readonly GiveMethod[];
  givingHistory: GivingRecord[];
}

const amounts = [10, 25, 50, 100];

export default function GiveClient({ church, funds, methods, givingHistory }: GiveClientProps) {
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [fund, setFund] = useState("general");
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [showHistory, setShowHistory] = useState(false);

  const totalGiven = givingHistory.reduce((sum, g) => sum + g.amount, 0);

  return (
    <div className="max-w-[460px] mx-auto p-5">
      <div className="bg-gradient-to-br from-gold to-[#d4b85e] -mx-5 -mt-5 px-5 pt-5 pb-7 rounded-b-3xl mb-6">
        <h1 className="font-serif text-church-dark text-2xl mb-1">Give</h1>
        <p className="text-church-dark/70 text-xs">Support the mission of The River</p>
      </div>

      {/* Giving Summary */}
      <Card className="mb-5 text-center">
        <p className="text-xs text-gray-500 mb-1">Your giving this year</p>
        <p className="text-3xl font-bold text-church-main">${totalGiven.toLocaleString()}</p>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-xs text-church-main font-semibold mt-2"
        >
          {showHistory ? "Hide History" : "View History"} →
        </button>
      </Card>

      {/* History */}
      {showHistory && (
        <Section label="GIVING HISTORY">
          <div className="space-y-2 mb-5">
            {givingHistory.map((g, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-900">${g.amount}</p>
                  <p className="text-xs text-gray-500">{g.fund}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{g.date}</p>
                  <p className="text-[10px] text-gray-400">{g.method}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Amount Selection */}
      <Section label="AMOUNT">
        <div className="grid grid-cols-4 gap-2 mb-3">
          {amounts.map((a) => (
            <button
              key={a}
              onClick={() => { setAmount(a); setCustomAmount(""); }}
              className={`py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                amount === a
                  ? "border-church-main bg-church-soft text-church-main"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              ${a}
            </button>
          ))}
        </div>
        <input
          type="number"
          placeholder="Other amount"
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setAmount(null); }}
          className="w-full px-3.5 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-church-main transition-colors"
        />
      </Section>

      {/* Fund Selection */}
      <Section label="FUND">
        <div className="space-y-2">
          {funds.map((f) => (
            <button
              key={f.id}
              onClick={() => setFund(f.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                fund === f.id
                  ? "border-church-main bg-church-soft"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{f.label}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
              {fund === f.id && <span className="text-church-main text-sm">✓</span>}
            </button>
          ))}
        </div>
      </Section>

      {/* Recurring Toggle */}
      <Section label="RECURRING">
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Make this recurring</p>
              <p className="text-xs text-gray-500">Automated scheduled giving</p>
            </div>
            <button
              onClick={() => setRecurring(!recurring)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                recurring ? "bg-church-main" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  recurring ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          {recurring && (
            <div className="flex gap-2">
              {["weekly", "biweekly", "monthly"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    frequency === f
                      ? "bg-church-main text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {f === "biweekly" ? "Bi-weekly" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          )}
        </Card>
      </Section>

      {/* Payment Methods */}
      <Section label="GIVE VIA">
        <div className="space-y-2">
          {methods.map((m) => (
            <a
              key={m.id}
              href={m.id === "donorperfect" ? church.donorPerfect : m.id === "venmo" ? "#" : undefined}
              target={m.id === "donorperfect" ? "_blank" : undefined}
              rel={m.id === "donorperfect" ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 no-underline hover:border-church-main transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-church-soft flex items-center justify-center text-lg">
                {m.id === "donorperfect" ? "💳" : m.id === "venmo" ? "📱" : m.id === "text" ? "💬" : "💵"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{m.label}</p>
                <p className="text-xs text-gray-500">{m.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
