import Navbar from "@/components/ui/navbar";
import { cookies } from "next/headers";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
        <Navbar userName={cookies().get('userName')?.value || ""}/>
        {children}
    </main>
  );
}
