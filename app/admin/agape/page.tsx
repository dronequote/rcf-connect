import { getStats } from "@/lib/data";
import AgapeClient from "./AgapeClient";

export default async function AgapeAdminPage() {
  return <AgapeClient stats={await getStats()} />;
}
