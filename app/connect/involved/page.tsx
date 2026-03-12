import ContactForm from "@/components/ContactForm";
import { INTEREST_TAGS } from "@/lib/constants";

export default function GetInvolvedPage() {
  return (
    <ContactForm
      title="Get Involved"
      subtitle="Find where you fit"
      interestOptions={INTEREST_TAGS.involved}
      formTag="Get Involved"
    />
  );
}
