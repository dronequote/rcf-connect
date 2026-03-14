"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ambassadorSignup } from "@/lib/ambassador-auth";

export default function AmbassadorSignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await ambassadorSignup({ firstName, lastName, email, phone });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Auto-redirect to login after signup
    setTimeout(() => router.push("/ambassador/login"), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A5632] to-[#0d3a1e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-white font-bold">The River Ambassadors</h1>
          <p className="text-white/70 text-sm mt-2">
            Invite your community — earn rewards for every life you touch!
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          {success ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="font-serif text-xl text-[#1A5632] mb-2">Welcome to the Team!</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your ambassador account has been created. Redirecting to login...
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-xl text-gray-900 text-center mb-1">Become an Ambassador</h2>
              <p className="text-xs text-gray-500 text-center mb-5">
                Share your unique referral link and earn points for every visitor, signup, and event attendance.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#1A5632]"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#1A5632]"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#1A5632]"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#1A5632]"
                />

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#1A5632] text-white text-sm font-bold disabled:opacity-50"
                >
                  {loading ? "Signing up..." : "Join the Ambassador Program"}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-4">
                Already an ambassador?{" "}
                <Link href="/ambassador/login" className="text-[#1A5632] font-semibold">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>

        {/* How It Works */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { step: "1", title: "Sign Up", desc: "Create your free ambassador account" },
            { step: "2", title: "Share", desc: "Send your unique referral link to friends" },
            { step: "3", title: "Earn", desc: "Get points when they visit, sign up, or attend" },
          ].map((s) => (
            <div key={s.step} className="bg-white/10 rounded-xl p-3 backdrop-blur">
              <div className="w-8 h-8 rounded-full bg-[#C8A84E] text-white text-sm font-bold flex items-center justify-center mx-auto mb-2">
                {s.step}
              </div>
              <p className="text-white text-xs font-bold">{s.title}</p>
              <p className="text-white/60 text-[10px] mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
