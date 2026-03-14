import { getStats, getVisitors } from "@/lib/data";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  return <AdminDashboardClient stats={await getStats()} visitors={await getVisitors()} />;
}
