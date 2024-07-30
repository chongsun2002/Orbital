import Navbar from "@/components/ui/navbarNew";
import { getUserDetails } from "@/lib/generalActions";
import { Notification } from "@/lib/types/userTypes";
import { deleteNotifications, getNotifications, viewNotification } from "@/lib/userActions";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = cookies().get('session')?.value;
  const username = session ? JSON.parse(session).name : "";
  const image = session ? JSON.parse(session).image : "";
  const jwt = session ? JSON.parse(session).JWT : undefined;
  let id: string = '';
  let notifications: Notification[] = [];

  if(jwt !== undefined ) {
      const decoded = jwtDecode(jwt);
      id = decoded.sub ?? '';
      try {
        notifications = await getNotifications();
      } catch (error) {
        id='';
      }
  }

  return (
    <main>
        <Navbar notifications={notifications} user={{id: id, name: username, image: image}} viewNotification={viewNotification} deleteNotifications={deleteNotifications}/>
        {children}
    </main>
  );
}
