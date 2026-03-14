"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Btn } from "@/components/ui";
import { requestStaffLogin } from "@/lib/staff-auth";
import { requestMemberLogin } from "@/lib/member-auth";
import type { ChurchInfo } from "@/lib/types";

type LoginStep = "email" | "sent";
type LoginType = "staff" | "member";

interface LoginClientProps {
  church: ChurchInfo;
}

export default function LoginClient({ church }: LoginClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("email");
  const [loginType, setLoginType] = useState<LoginType>("staff");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devLink, setDevLink] = useState("");

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const result =
        loginType === "staff"
          ? await requestStaffLogin(email.trim())
          : await requestMemberLogin(email.trim());

      if (result.devLink) {
        setDevLink(result.devLink);
      }
      setStep("sent");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDevLink = () => {
    if (devLink) {
      router.push(devLink);
    }
  };

  // ─── "Check Your Email" Screen ───
  if (step === "sent") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-church-dark to-church-main flex items-center justify-center p-5">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-white text-3xl mx-auto mb-4">
              ✉️
            </div>
            <h1 className="font-serif text-2xl text-white">Check Your Email</h1>
            <p className="text-white/70 text-sm mt-2">
              We sent a login link to{" "}
              <strong className="text-white">{email}</strong>
            </p>
          </div>

          <Card className="mb-4">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Click the link in your email to sign in. The link expires in 1
                hour.
              </p>
              <p className="text-xs text-gray-400">
                Don&apos;t see it? Check your spam folder.
              </p>
              <button
                onClick={() => {
                  setStep("email");
                  setDevLink("");
                }}
                className="text-xs text-church-main font-semibold bg-transparent border-none cursor-pointer hover:underline"
              >
                Try a different email
              </button>
            </div>
          </Card>

          {/* Dev mode: show direct link */}
          {devLink && (
            <Card>
              <div className="text-center space-y-2">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                  Dev Mode — Direct Link
                </p>
                <button
                  onClick={handleDevLink}
                  className="w-full py-2.5 rounded-lg bg-amber-500 text-white text-sm font-semibold cursor-pointer border-none hover:bg-amber-600 transition-colors"
                >
                  Click to Verify &amp; Sign In
                </button>
                <p className="text-[9px] text-gray-400 break-all">{devLink}</p>
              </div>
            </Card>
          )}

          <p className="text-center text-white/40 text-[10px] mt-6">
            {church.name}
          </p>
        </div>
      </div>
    );
  }

  // ─── Email Entry Screen ───
  return (
    <div className="min-h-screen bg-gradient-to-br from-church-dark to-church-main flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {church.logo}
          </div>
          <h1 className="font-serif text-2xl text-white">{church.shortName}</h1>
          <p className="text-white/60 text-xs mt-1">RCF Connect Portal</p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex bg-white/10 rounded-xl p-1 mb-4">
          <button
            onClick={() => setLoginType("staff")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all ${
              loginType === "staff"
                ? "bg-white text-church-dark"
                : "bg-transparent text-white/60 hover:text-white"
            }`}
          >
            Staff Login
          </button>
          <button
            onClick={() => setLoginType("member")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all ${
              loginType === "member"
                ? "bg-white text-church-dark"
                : "bg-transparent text-white/60 hover:text-white"
            }`}
          >
            Member Login
          </button>
        </div>

        {/* Magic Link Form */}
        <Card className="mb-4">
          <form onSubmit={handleRequestLink} className="space-y-3">
            <p className="text-xs text-gray-500 text-center">
              {loginType === "staff"
                ? "Enter your staff email to receive a login link"
                : "Enter your email to access your member portal"}
            </p>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-church-main transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}

            <Btn full type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Login Link"}
            </Btn>
          </form>
        </Card>

        <p className="text-center text-white/50 text-xs">
          No password needed — we&apos;ll email you a secure link
        </p>

        <p className="text-center text-white/40 text-[10px] mt-6">
          {church.name} · {church.address}
        </p>
      </div>
    </div>
  );
}
