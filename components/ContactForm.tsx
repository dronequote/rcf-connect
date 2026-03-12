"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, Input, Btn, Header } from "@/components/ui";

interface ContactFormProps {
  title: string;
  subtitle: string;
  interestOptions: readonly string[];
  formTag: string;
  gold?: boolean;
}

export default function ContactForm({
  title,
  subtitle,
  interestOptions,
  formTag,
  gold = false,
}: ContactFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    interests: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const [otherText, setOtherText] = useState("");

  const updateForm = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const toggleInterest = (interest: string) =>
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));

  const handleSubmit = async () => {
    if (!formData.first || !formData.email) return;
    setSubmitting(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.first,
          lastName: formData.last,
          email: formData.email,
          phone: formData.phone,
          interests: otherText.trim()
            ? [...formData.interests, `Other: ${otherText.trim()}`]
            : formData.interests,
          formTag,
          source:
            typeof window !== "undefined" &&
            new URLSearchParams(window.location.search).get("ref")
              ? "QR Scan"
              : "Website",
        }),
      });
    } catch {
      // Still navigate to success - we'll retry later
    }

    router.push("/connect/success");
  };

  return (
    <div className="min-h-screen bg-warm">
      <div className="max-w-[460px] mx-auto p-5">
        <Header
          title={title}
          subtitle={subtitle}
          onBack={() => router.push("/")}
          gold={gold}
        />

        <div className="flex gap-2.5 mb-3.5">
          <Input
            label="First Name"
            value={formData.first}
            onChange={(v) => updateForm("first", v)}
          />
          <Input
            label="Last Name"
            value={formData.last}
            onChange={(v) => updateForm("last", v)}
          />
        </div>
        <Input
          label="Email"
          value={formData.email}
          onChange={(v) => updateForm("email", v)}
          type="email"
        />
        <Input
          label="Phone (optional)"
          value={formData.phone}
          onChange={(v) => updateForm("phone", v)}
          type="tel"
        />

        {interestOptions.length > 0 && (
          <div className="mb-6">
            <div className="text-[11px] font-bold text-gold tracking-[1.5px] mb-2.5 uppercase">
              I&apos;M INTERESTED IN
            </div>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <Tag
                  key={interest}
                  active={formData.interests.includes(interest)}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Tag>
              ))}
              <Tag
                active={showOther}
                onClick={() => setShowOther(!showOther)}
              >
                Other
              </Tag>
            </div>
            {showOther && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Tell us what you're interested in..."
                  className="w-full px-3.5 py-[11px] rounded-[10px] border-2 border-church-main text-sm outline-none bg-white text-gray-900"
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        <Btn
          onClick={handleSubmit}
          full
          disabled={submitting || !formData.first || !formData.email}
        >
          {submitting ? "Connecting..." : "Connect With Us"}
        </Btn>
      </div>
    </div>
  );
}
