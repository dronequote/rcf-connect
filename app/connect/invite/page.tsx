import { getChurch } from "@/lib/data";
import InviteClient from "./InviteClient";

export default async function InvitePage() {
  const church = await getChurch();
  return <InviteClient church={church} />;
}
