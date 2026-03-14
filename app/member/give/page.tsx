import { getChurch, getGiveFunds, getGiveMethods, getGivingHistory } from "@/lib/data";
import GiveClient from "./GiveClient";

export default async function MemberGivePage() {
  return (
    <GiveClient
      church={await getChurch()}
      funds={await getGiveFunds()}
      methods={await getGiveMethods()}
      givingHistory={await getGivingHistory()}
    />
  );
}
