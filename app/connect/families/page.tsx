import ContactForm from "@/components/ContactForm";
import { getInterestTags } from "@/lib/data";

export default async function FamiliesPage() {
  const tags = await getInterestTags();
  return (
    <ContactForm
      title="Kids & Families"
      subtitle="Safe, fun programs for every age"
      interestOptions={tags.families}
      formTag="Kids & Families"
    />
  );
}
