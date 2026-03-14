import { getChurch, getMember, getSermons, getStats, getEvents } from "@/lib/data";
import MemberHomeClient from "./MemberHomeClient";

export default async function MemberHome() {
  return (
    <MemberHomeClient
      church={await getChurch()}
      member={await getMember()}
      sermons={await getSermons()}
      stats={await getStats()}
      events={await getEvents()}
    />
  );
}
