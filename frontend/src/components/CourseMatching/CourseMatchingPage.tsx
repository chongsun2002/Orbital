"use client"

import CourseHeading from "@/components/CourseMatching/CourseHeading"
import ProfileDisplay from "@/components/User/ProfileDisplay"
import CourseCard from "@/components/CourseMatching/CourseCard"
import Timetable from "@/components/CourseMatching/Timetable"
import LinkAdder from "@/components/CourseMatching/LinkAdder"
import { getUserDetails, getUserId, UserDetails } from "@/lib/generalActions"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import SelectFriend from "@/components/CourseMatching/SelectFriend"
import { useState } from "react"
import { Friend } from "@/lib/friendsActions"

const CourseMatching = ({props}: {props: {user: UserDetails, friends: Friend[]}}) => {
    const [friendUrl, setFriendUrl] = useState("");
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

            <SelectFriend onChange={setFriendUrl} friends={props.friends}/>

            {/*<LinkAdder />*/}

            <Timetable NUSModsURLs={[
                {name: props.user.name, url: props.user.timetableUrl ?? "https://nusmods.com/timetable/sem-2/share?CS2030S=LAB:14B,REC:24,LEC:2&CS2040S=REC:04,TUT:52,LEC:2&IS1108=TUT:06,LEC:2&MA1522=TUT:9,LEC:2&ST1131=LEC:1,TUT:5&ST2334=TUT:9,LEC:2&UTW1001O=SEC:1"},
                {name: "Chong Sun", url: "https://nusmods.com/timetable/sem-2/share?CS2030S=LAB:14B,REC:24,LEC:2&CS2040S=REC:04,TUT:52,LEC:2&IS1108=TUT:06,LEC:2&MA1522=TUT:9,LEC:2&ST1131=LEC:1,TUT:5&ST2334=TUT:9,LEC:2&UTW1001O=SEC:1"}
            ]}/>
        </div>
    )
}

export default CourseMatching