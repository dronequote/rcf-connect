"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyAmbassadorToken, setSession } from "@/lib/ambassador-auth";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setError("No token provided");
      return;
    }

    verifyAmbassadorToken(token)
      .then((result) => {
        if (result.valid && result.sessionToken && result.ambassador) {
          setSession(result.sessionToken, result.ambassador);
          setStatus("success");
          setTimeout(() => router.push("/ambassador/dashboard"), 1500);
        } else {
          setStatus("error");
          setError(result.error || "Invalid or expired link");
        }
      })
      .catch(() => {
        setStatus("error");
        setError("Verification failed");
      });
  }, [searchParams, router]);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full text-center">
      {status === "verifying" && (
        <>
          <div className="text-4xl mb-3 animate-pulse">🔗</div>
          <h2 className="font-serif text-lg text-gray-900">Verifying your link...</h2>
          <p className="text-xs text-gray-500 mt-1">Just a moment</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="text-4xl mb-3">✅</div>
          <h2 className="font-serif text-lg text-[#1A5632]">You&apos;re in!</h2>
          <p className="text-sm text-gray-600 mt-1">Redirecting to your dashboard...</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="text-4xl mb-3">❌</div>
          <h2 className="font-serif text-lg text-red-600">Verification Failed</h2>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
          <a
            href="/ambassador/login"
            className="inline-block mt-4 px-4 py-2 bg-[#1A5632] text-white text-xs font-bold rounded-lg"
          >
            Try Again
          </a>
        </>
      )}
    </div>
  );
}

export default function AmbassadorVerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A5632] to-[#0d3a1e] flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full text-center">
            <div className="text-4xl mb-3 animate-pulse">🔗</div>
            <h2 className="font-serif text-lg text-gray-900">Verifying your link...</h2>
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
    </div>
  );
}
