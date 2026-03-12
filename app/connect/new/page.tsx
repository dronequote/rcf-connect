import ContactForm from "@/components/ContactForm";
import { INTEREST_TAGS } from "@/lib/constants";

export default function NewVisitorPage() {
  return (
    <ContactForm
      title="Welcome to The River"
      subtitle="We'd love to get to know you"
      interestOptions={INTEREST_TAGS.new}
      formTag="New Visitor"
    />
  );
}
