import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
    const session = cookies().get('session')?.value;
    const jwt = session ? JSON.parse(session).JWT : undefined;
    if (jwt === undefined) {
        redirect('/login');
    }
    const decoded = jwtDecode(jwt);
    redirect('/user/' + decoded.sub);
}

export default Page;