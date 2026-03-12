import ContactForm from "@/components/ContactForm";
import { INTEREST_TAGS } from "@/lib/constants";

export default function FamiliesPage() {
  return (
    <ContactForm
      title="Kids & Families"
      subtitle="Safe, fun programs for every age"
      interestOptions={INTEREST_TAGS.families}
      formTag="Kids & Families"
    />
  );
}
