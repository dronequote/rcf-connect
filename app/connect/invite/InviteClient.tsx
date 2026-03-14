"use client";

import { useRouter } from "next/navigation";
import { Header, Card, Btn } from "@/components/ui";
import type { ChurchInfo } from "@/lib/types";

export default function InviteClient({ church }: { church: ChurchInfo }) {
  const router = useRouter();

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "You're Invited to The River",
          text: "Come visit The River Christian Fellowship this Sunday!",
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  return (
    <div className="min-h-screen bg-warm">
      <div className="max-w-[460px] mx-auto p-5">
        <Header
          title="Invite a Friend"
          subtitle="Share the love of The River"
          onBack={() => router.push("/")}
        />

        <div className="animate-fade-up">
          <Card className="mb-5 text-center">
            <div className="text-5xl mb-4">💌</div>
            <h3 className="font-serif text-xl text-church-main mb-2">
              You&apos;re Invited!
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-1">
              Join us at <strong>The River Christian Fellowship</strong>
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Sundays at 10:00 AM &amp; 6:00 PM
            </p>
            <div className="bg-church-soft rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <a
                href={church.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-church-main no-underline hover:underline"
              >
                {church.address} →
              </a>
            </div>
            <p className="text-xs text-gray-400 italic leading-relaxed">
              {church.featuredVerse}
            </p>
          </Card>

          {/* Native share (mobile) */}
          <Btn onClick={handleShare} full>
            Share This Invite
          </Btn>

          <div className="text-center mt-4">
            <p className="text-[11px] text-gray-400 mb-2">
              Or text <span className="font-bold text-church-main">&quot;invite&quot;</span> to{" "}
              <span className="font-bold text-church-main">{church.textToGive}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
