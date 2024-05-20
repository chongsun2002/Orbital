import Navbar from "@/components/ui/navbar";
import { cookies } from "next/headers";

export default async function Home() {
  return (
    <div>
      <Navbar userName={cookies().get('userName')?.value || ""}/>
    </div>
  )}