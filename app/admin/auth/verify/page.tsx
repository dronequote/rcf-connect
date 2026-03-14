"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyStaffMagicLink } from "@/lib/staff-auth";
import { Card } from "@/components/ui";

function StaffVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setError("No verification token found.");
      return;
    }

    verifyStaffMagicLink(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/admin"), 1500);
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message || "Verification failed.");
      });
  }, [searchParams, router]);

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-white text-3xl mx-auto mb-4">
          {status === "verifying" && "⏳"}
          {status === "success" && "✅"}
          {status === "error" && "❌"}
        </div>
        <h1 className="font-serif text-2xl text-white">
          {status === "verifying" && "Verifying..."}
          {status === "success" && "Welcome, Staff!"}
          {status === "error" && "Verification Failed"}
        </h1>
      </div>

      <Card>
        <div className="text-center py-2">
          {status === "verifying" && (
            <p className="text-sm text-gray-500">
              Verifying your staff login link...
            </p>
          )}
          {status === "success" && (
            <p className="text-sm text-green-600 font-semibold">
              Signed in successfully! Redirecting to dashboard...
            </p>
          )}
          {status === "error" && (
            <div className="space-y-3">
              <p className="text-sm text-red-500">{error}</p>
              <button
                onClick={() => router.push("/login")}
                className="text-sm text-church-main font-semibold bg-transparent border-none cursor-pointer hover:underline"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function StaffVerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-church-dark to-church-main flex items-center justify-center p-5">
      <Suspense
        fallback={
          <div className="text-center">
            <p className="text-white/60 text-sm">Loading...</p>
          </div>
        }
      >
        <StaffVerifyContent />
      </Suspense>
    </div>
  );
}
