import "@/app/globals.css";
import Navbar from "@/components/ui/navbar";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
        <div><Navbar /></div>
        {children}
    </main>
  );
}
