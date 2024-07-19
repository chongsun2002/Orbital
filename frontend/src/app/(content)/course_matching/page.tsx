import CourseMatching from "@/components/CourseMatching/CourseMatchingPage";
import Timetable from "@/components/CourseMatching/Timetable";
import { getNUSModsURLs } from "@/lib/courseActions";
import { Friend, getFriends } from "@/lib/friendsActions";
import { getUserDetails, UserDetails } from "@/lib/userActions";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function Page({ searchParams }: { searchParams: { name?: string, url?: string }}) {
    let me: UserDetails;
    let friends: Friend[];
    try {
        const session = cookies().get('session')?.value;
        const jwt = session ? JSON.parse(session).JWT : undefined;
        let id: string = '';
        if(jwt !== undefined) {
            const decoded = jwtDecode(jwt);
            id = decoded.sub ?? '';
        }
        me = await getUserDetails(id);
        friends = await getFriends();
    } catch (error) {
        return <div>{(error as Error).message}</div>
    }
    const url = searchParams.url ? decodeURIComponent(searchParams.url) : "";

    return (
        <div>
            {<CourseMatching friends={friends}/>}
            <Timetable NUSModsURLs={[
                {name: me.name, url: me.timetableUrl ?? ""}
            ].concat(await getNUSModsURLs())}/>
        </div>
    );
}