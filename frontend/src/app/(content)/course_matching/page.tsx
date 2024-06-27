import CourseMatching from "@/components/CourseMatching/CourseMatchingPage";
import { Friend, getFriends } from "@/lib/friendsActions";
import { getUserDetails, getUserId, UserDetails } from "@/lib/generalActions";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function Page() {
    try {
        const session = cookies().get('session')?.value;
        const jwt = session ? JSON.parse(session).JWT : undefined;
        var id: string = '';
        if(jwt !== undefined) {
            const decoded = jwtDecode(jwt);
            id = decoded.sub ?? '';
        }
        var me: UserDetails = await getUserDetails(id);
        var friends: Friend[] = await getFriends(); 
    } catch (error) {
        return <div>{(error as Error).message}</div>
    }

    return (
        <div>
            <CourseMatching props={{user: me, friends: friends}}/>
        </div>
    );
}