import { getChurch } from "@/lib/data";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  return <LoginClient church={await getChurch()} />;
}
