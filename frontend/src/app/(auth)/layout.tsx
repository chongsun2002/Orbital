import { Logo } from "@/components/ui/logo"

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
        <div className="absolute top-[24px] left-[24px]"><Logo /></div>
        {children}
    </main>
  );
}
