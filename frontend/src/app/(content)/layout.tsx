import Navbar from "@/components/ui/navbarNew";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = cookies().get('session')?.value;
  const username = session ? JSON.parse(session).name : "";
  const image = session ? JSON.parse(session).image : "";
  const jwt = session ? JSON.parse(session).JWT : undefined;
  let id: string = '';
  if(jwt !== undefined) {
      const decoded = jwtDecode(jwt);
      id = decoded.sub ?? '';
  }

  return (
    <main>
        <Navbar user={{id: id, name: username, image: image}}/>
        {children}
    </main>
  );
}
