import SelectFriend from "@/components/CourseMatching/SelectFriend"
import { useTransition } from "react"
import { Friend } from "@/lib/friendsActions"
import { useRouter } from "next/navigation"
import { usePathname, useSearchParams } from "next/navigation"
import { addNUSModsURLToCookies, getNUSModsURLs } from "@/lib/courseActions"

const CourseMatching = ({friends}: {friends: Friend[]}) => {
    // const router = useRouter();
    // const pathname = usePathname();

    // const [isPending, startTransition] = useTransition();
    
    // const onChange = (value: string) => {
    //     const updatedSearchParams = new URLSearchParams(value);
    //     startTransition(() => {
    //         router.replace(`${pathname}?${updatedSearchParams.toString()}`);
    //     });
    // };

    const onChange = async (value: string) => {
        "use server"
        try {
            const selectedFriend: {name: string, url: string} = JSON.parse(value);
            addNUSModsURLToCookies(selectedFriend);
        } catch (error) {
            console.error("Failed to add friend to timetable.");
        }
    }
    const NUSModsURLs: {name: string, url: string}[] = getNUSModsURLs();
    return(
        <div className='flex flex-col justify-left gap-[30px] mx-[80px] mt-[56px]'>
            <div className="text-black font-sans text-[64px] font-[700] tracking-[-1.28px]"> 
                Course Matching
            </div>
            {/* <div className='flex bg-[#DEDEDE] justify-evenly items-center h-[650px]'>
                <CourseCard>
                    <CourseHeading>MA1522</CourseHeading>
                    <ProfileDisplay name='Xan' image='' />
                </CourseCard>
                <CourseCard />
                <CourseCard />
                <CourseCard />
            </div> */}

            <SelectFriend onChange={onChange} friends={friends} NUSModsURLs={NUSModsURLs}/>
            {/* {isPending && <div>Loading...</div>} */}
            {/*<LinkAdder />*/}


        </div>
    )
}

export default CourseMatching