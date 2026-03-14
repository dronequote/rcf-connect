"use client";

import { useState } from "react";
import { Card, Section, Input, Btn } from "@/components/ui";
import type { ChurchInfo } from "@/lib/types";

interface PrayerClientProps {
  church: ChurchInfo;
}

export default function PrayerClient({ church }: PrayerClientProps) {
  const [request, setRequest] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="max-w-[460px] mx-auto p-5">
        <div className="bg-gradient-to-br from-church-main to-church-light -mx-5 -mt-5 px-5 pt-5 pb-7 rounded-b-3xl mb-6">
          <h1 className="font-serif text-white text-2xl mb-1">Prayer</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-5xl mb-4 animate-checkmark">🙏</div>
          <h2 className="font-serif text-2xl text-church-main mb-2">
            Prayer Received
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-xs mx-auto">
            {isPrivate
              ? "Your request has been shared with the pastoral team only."
              : "Your request has been shared with our prayer group."}
          </p>
          <p className="text-xs text-gray-400 italic mb-6">
            &ldquo;Cast all your anxiety on him because he cares for you.&rdquo; — 1 Peter 5:7
          </p>
          <Btn onClick={() => { setSubmitted(false); setRequest(""); }}>
            Submit Another Request
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[460px] mx-auto p-5">
      <div className="bg-gradient-to-br from-church-main to-church-light -mx-5 -mt-5 px-5 pt-5 pb-7 rounded-b-3xl mb-6">
        <h1 className="font-serif text-white text-2xl mb-1">Prayer Requests</h1>
        <p className="text-white/70 text-xs">We&apos;d love to pray with you</p>
      </div>

      <Section label="YOUR REQUEST">
        <Card className="mb-4">
          <textarea
            rows={5}
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Share what's on your heart..."
            className="w-full px-3.5 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-church-main transition-colors resize-y bg-white"
          />
        </Card>
      </Section>

      <Section label="PRIVACY">
        <Card className="mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Keep private</p>
              <p className="text-xs text-gray-500">
                {isPrivate ? "Pastoral team only" : "Shared with prayer group"}
              </p>
            </div>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                isPrivate ? "bg-church-main" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  isPrivate ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </Card>
      </Section>

      <Btn
        full
        onClick={() => setSubmitted(true)}
        disabled={!request.trim()}
      >
        Submit Prayer Request
      </Btn>

      <Card className="mt-6 text-center">
        <p className="text-xs text-gray-500 mb-1">Need immediate prayer?</p>
        <p className="text-sm font-semibold text-gray-900">{church.prayerContact.name}</p>
        <a
          href={`tel:${church.prayerContact.phone}`}
          className="text-sm text-church-main font-semibold no-underline"
        >
          {church.prayerContact.phone}
        </a>
      </Card>
    </div>
  );
}
