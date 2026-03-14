import { getMember } from "@/lib/data";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  return <ProfileClient member={await getMember()} />;
}
