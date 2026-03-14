import { getChurch } from "@/lib/data";
import GiveClient from "./GiveClient";

export default async function GivePage() {
  const church = await getChurch();
  return <GiveClient church={church} />;
}
