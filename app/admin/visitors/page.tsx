import { getVisitors } from "@/lib/data";
import VisitorsClient from "./VisitorsClient";

export default async function VisitorsPage() {
  return <VisitorsClient visitors={await getVisitors()} />;
}
