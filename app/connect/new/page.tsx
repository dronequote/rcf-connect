import ContactForm from "@/components/ContactForm";
import { getInterestTags } from "@/lib/data";

export default async function NewVisitorPage() {
  const tags = await getInterestTags();
  return (
    <ContactForm
      title="Welcome to The River"
      subtitle="We'd love to get to know you"
      interestOptions={tags.new}
      formTag="New Visitor"
    />
  );
}
