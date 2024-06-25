import CourseHeading from "@/components/CourseMatching/CourseHeading"
import ProfileDisplay from "@/components/User/ProfileDisplay"
import CourseCard from "@/components/CourseMatching/CourseCard"
import Timetable from "@/components/CourseMatching/Timetable"
import LinkAdder from "@/components/CourseMatching/LinkAdder"

const courseMatching = () => {
    return(
        <div>
            <div className="text-black font-sans text-[64px] font-[700] tracking-[-1.28px] mt-[56px] ml-[80px] mb-[80px]">
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
            <LinkAdder />
            <Timetable NUSModsURLs={[
                {name: "Xan", url: "https://nusmods.com/timetable/sem-2/share?CS2030S=LAB:14A,LEC:2,REC:23&CS2040S=TUT:38,LEC:2,REC:05&HSI1000=WS:E2,LEC:1&IS1108=TUT:11,LEC:2&MA1521=TUT:10,LEC:1&UTW1001K=SEC:2"},
                {name: "Chong Sun", url: "	https://nusmods.com/timetable/sem-2/share?CS2030S=LAB:14B,REC:24,LEC:2&CS2040S=REC:04,TUT:52,LEC:2&IS1108=TUT:06,LEC:2&MA1522=TUT:9,LEC:2&ST1131=LEC:1,TUT:5&ST2334=TUT:9,LEC:2&UTW1001O=SEC:1"}
            ]}/>
        </div>
    )
}

export default courseMatching