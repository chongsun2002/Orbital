import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { jwtDecode } from "jwt-decode";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import Navbar from "@/components/ui/navbarNew";

export default async function Home() {
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
        <div>
            <Navbar user={{id: id, name: username, image: image}}/>
            <div className="flex flex-col content-center gap-5 mt-20">
                <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-5xl text-center">Spice up your social life</h1>
                <p className="text-xl text-muted-foreground text-center">
                    Plan classes together. Meet a new friend. Have fun!
                </p>            
            </div>
            <div className="flex flex-col sm:grid grid-cols-2 grid-rows-3 gap-x-10 gap-y-20 mx-[80px] mt-20 items-center justify-items-center">
                <div className="flex flex-col gap-5 w-[80vw] sm:w-[350px]">
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Course Matching</h2>
                    <p>
                        See which courses your friends are taking. Enhance your learning by matching schedule for a shared academic journey.
                    </p>
                    <Button className="w-[150px]">
                        <Link href="/course_matching">Match Courses!</Link>
                    </Button>
                </div>
                <img src="/match_courses_image.jpg"></img>
                <img src="/activities_image.jpg"></img>
                <div className="flex flex-col gap-5 w-[80vw] sm:w-[350px]">
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Explore Activities</h2>
                    <p className="w-full">
                        Set up lunch dates, study sessions, or any activity you can imagine. Invite friends or open the invite to strangers and connect with new faces.
                    </p>
                    <Button className="w-[150px]">
                        <Link href="/activities">Explore Activities!</Link>
                    </Button>
                </div>
                <div className="flex flex-col gap-5 w-[80vw] sm:w-[350px]">
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Find Friends</h2>
                    <p className="w-full">
                        Find and follow friends openly or choose our unique anonymous follow option. Connect more freely and expand your social circle!
                    </p>
                    <Button className="w-[150px]">
                        <Link href="/friends">Find Friends!</Link>
                    </Button>
                </div>
                <img src="/friends_image.jpg"></img>
            </div>
        </div>
    )
}