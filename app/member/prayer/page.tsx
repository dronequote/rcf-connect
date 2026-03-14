import { getChurch } from "@/lib/data";
import PrayerClient from "./PrayerClient";

export default async function PrayerPage() {
  return <PrayerClient church={await getChurch()} />;
}
