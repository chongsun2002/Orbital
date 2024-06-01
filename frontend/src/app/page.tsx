import Navbar from "@/components/ui/navbar";
import { cookies } from "next/headers";

export default async function Home() {
  const session = cookies().get('session')?.value;
  const username = session ? JSON.parse(session).name : "";
  return (
    <div>
      <Navbar userName={username}/>
    </div>
  )}