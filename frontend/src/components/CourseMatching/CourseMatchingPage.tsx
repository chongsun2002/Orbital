"use client"

import SelectFriend from "@/components/CourseMatching/SelectFriend"
import { useTransition } from "react"
import { Friend } from "@/lib/friendsActions"
import { useRouter } from "next/navigation"
import { usePathname, useSearchParams } from "next/navigation"

const CourseMatching = ({friends}: {friends: Friend[]}) => {
    const router = useRouter();
    const pathname = usePathname();

    const [isPending, startTransition] = useTransition();
    
    const onChange = (value: string) => {
        const updatedSearchParams = new URLSearchParams(value);
        startTransition(() => {
            router.replace(`${pathname}?${updatedSearchParams.toString()}`);
        });
    };

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

            <SelectFriend onChange={onChange} friends={friends}/>
            {isPending && <div>Loading...</div>}
            {/*<LinkAdder />*/}


        </div>
    )
}

export default CourseMatching