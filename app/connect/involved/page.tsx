import ContactForm from "@/components/ContactForm";
import { getInterestTags } from "@/lib/data";

export default async function GetInvolvedPage() {
  const tags = await getInterestTags();
  return (
    <ContactForm
      title="Get Involved"
      subtitle="Find where you fit"
      interestOptions={tags.involved}
      formTag="Get Involved"
    />
  );
}
