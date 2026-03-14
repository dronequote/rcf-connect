import { getEvents } from "@/lib/data";
import EventsClient from "./EventsClient";

export default async function MemberEventsPage() {
  return <EventsClient events={await getEvents()} />;
}
