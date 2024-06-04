import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNavBar } from "@/components/ui/bottomnav";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adventus",
  description: "Adventus Social Media App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
