import CourseMatching from "@/components/CourseMatching/CourseMatchingPage";
import Timetable from "@/components/CourseMatching/Timetable";
import { Friend, getFriends } from "@/lib/friendsActions";
import { getUserDetails, getUserId, UserDetails } from "@/lib/generalActions";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function Page({ searchParams }: { searchParams: { name?: string, url?: string }}) {
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

    const url = searchParams.url ? decodeURIComponent(searchParams.url) : "";

    return (
        <div>
            <CourseMatching friends={friends}/> 
            <Timetable NUSModsURLs={[
                {name: me.name, url: me.timetableUrl ?? ""},
                {name: searchParams.name ?? "Your friend", url: url}
            ]}/>
        </div>
    );
}