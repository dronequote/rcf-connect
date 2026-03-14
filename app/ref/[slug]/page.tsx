"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

export default function ReferralRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    // Generate a session ID for click tracking
    const sessionId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2);

    // Store referral info in cookie for attribution
    document.cookie = `rcf_ref=${slug};path=/;max-age=${90 * 24 * 60 * 60};SameSite=Lax`;
    document.cookie = `rcf_ref_session=${sessionId};path=/;max-age=${90 * 24 * 60 * 60};SameSite=Lax`;

    // Track the click
    fetch("/api/ambassador/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ambassadorSlug: slug,
        sessionId,
        path: `/ref/${slug}`,
        destination: "/",
      }),
    })
      .then(() => {
        // Redirect to the church homepage
        router.push("/");
      })
      .catch(() => {
        // Still redirect even if tracking fails
        router.push("/");
      });

    // Fallback redirect if the fetch takes too long
    const timeout = setTimeout(() => router.push("/"), 3000);
    return () => clearTimeout(timeout);
  }, [slug, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#1A5632] flex items-center justify-center p-4">
        <div className="text-center text-white">
          <p className="text-sm">Redirecting you to River Christian Fellowship...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A5632] flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="font-serif text-2xl mb-2">River Christian Fellowship</h1>
        <p className="text-sm text-white/70">You were referred by one of our ambassadors!</p>
        <p className="text-xs text-white/50 mt-3">Redirecting...</p>
      </div>
    </div>
  );
}
