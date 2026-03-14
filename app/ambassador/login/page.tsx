"use client";

import { useState } from "react";
import Link from "next/link";
import { requestAmbassadorMagicLink } from "@/lib/ambassador-auth";

export default function AmbassadorLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await requestAmbassadorMagicLink(email);
    setSent(true);
    setLoading(false);

    // Dev mode: show the magic link directly
    if (result.devLink) {
      setDevLink(result.devLink);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A5632] to-[#0d3a1e] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-white font-bold">The River Ambassadors</h1>
          <p className="text-white/70 text-sm mt-2">Log in to your ambassador dashboard</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📧</div>
              <h2 className="font-serif text-lg text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-sm text-gray-600 mb-4">
                If <strong>{email}</strong> is registered, we&apos;ve sent a login link.
              </p>

              {devLink && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-[10px] text-yellow-700 font-bold uppercase mb-1">Dev Mode — Magic Link</p>
                  <Link
                    href={devLink}
                    className="text-xs text-[#1A5632] font-semibold underline break-all"
                  >
                    {devLink}
                  </Link>
                </div>
              )}

              <button
                onClick={() => { setSent(false); setDevLink(""); }}
                className="mt-4 text-xs text-[#1A5632] font-semibold"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-lg text-gray-900 text-center mb-1">Ambassador Login</h2>
              <p className="text-xs text-gray-500 text-center mb-5">
                Enter your email to receive a magic login link — no password needed.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#1A5632]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#1A5632] text-white text-sm font-bold disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Login Link"}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-4">
                Not an ambassador yet?{" "}
                <Link href="/ambassador" className="text-[#1A5632] font-semibold">
                  Sign up
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
