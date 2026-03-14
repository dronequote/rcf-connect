import { getChurch } from "@/lib/data";
import AgapeClient from "./AgapeClient";

export default async function AgapePage() {
  const church = await getChurch();
  return <AgapeClient church={church} />;
}
