import { getSermons } from "@/lib/data";
import SermonClient from "./SermonClient";

export default async function SermonPage() {
  return <SermonClient sermons={await getSermons()} />;
}
