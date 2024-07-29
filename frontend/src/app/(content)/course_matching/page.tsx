import CourseMatching from "@/components/CourseMatching/CourseMatchingPage";
import LinkAdder from "@/components/CourseMatching/LinkAdder";
import Timetable from "@/components/CourseMatching/Timetable";
import { addColorAssignments, getColorAssignments, getNUSModsURLs } from "@/lib/courseActions";
import { parseNUSModsURL } from "@/lib/courseUtils";
import { Friend, getFriends } from "@/lib/friendsActions";
import { getUserDetails, getUserId, updateUserTimetableColors, UserDetails } from "@/lib/generalActions";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function Page({ searchParams }: { searchParams: { name?: string, url?: string }}) {
    let me: UserDetails | null = null;
    let friends: Friend[] = [];
    try {
        const session = cookies().get('session')?.value;
        const jwt = session ? JSON.parse(session).JWT : undefined;
        let id: string = '';
        if(jwt !== undefined) {
            const decoded = jwtDecode(jwt);
            id = decoded.sub ?? '';
            me = await getUserDetails(id);
            friends = await getFriends();
        }
    } catch (error) {
        console.error(error);
        return <div>{(error as Error).message}</div>
    }
    const url = searchParams.url ? decodeURIComponent(searchParams.url) : "";
    return (
        <div>
            {<CourseMatching isLoggedIn={!!me} friends={friends}/>}
            <LinkAdder />
            <Timetable NUSModsURLs={!!me ? [
                {name: me.name, url: me.timetableUrl ?? "", isFriend: true}
            ].concat(await getNUSModsURLs()) : await getNUSModsURLs()} currentUserName={me?.name}/>
        </div>
    );
}