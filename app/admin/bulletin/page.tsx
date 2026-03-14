import { getEvents } from "@/lib/data";
import BulletinClient from "./BulletinClient";

export default async function BulletinPage() {
  return <BulletinClient events={await getEvents()} />;
}
