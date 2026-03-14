import { getStats } from "@/lib/data";
import SocialClient from "./SocialClient";

export default async function SocialPage() {
  return <SocialClient stats={await getStats()} />;
}
