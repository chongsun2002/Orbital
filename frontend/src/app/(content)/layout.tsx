import Navbar from "@/components/ui/navbar";
import { cookies } from "next/headers";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = cookies().get('session')?.value;
  const username = session ? JSON.parse(session).name : "";
  return (
    <main>
        <Navbar userName={username}/>
        {children}
    </main>
  );
}
