import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = () => {
    const jwt = cookies().get('JWT');
    if (jwt === undefined) {
        redirect('/login');
    }
    const decoded = jwtDecode(jwt.value);
    redirect('/user/' + decoded.sub);
}

export default Page;