import { getSermons } from "@/lib/data";
import AiToolsClient from "./AiToolsClient";

export default async function AIToolsPage() {
  return <AiToolsClient sermons={await getSermons()} />;
}
