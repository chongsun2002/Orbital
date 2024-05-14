import CourseHeading from "@/components/CourseMatching/CourseHeading"
import ProfileDisplay from "@/components/User/ProfileDisplay"
import CourseCard from "@/components/CourseMatching/CourseCard"

const courseMatching = () => {
    return(
        <div>
            <div className="text-black font-sans text-[64px] font-[700] tracking-[-1.28px] ml-[80px] mb-[80px]">
                Course Matching
            </div>
            <div className='flex bg-[#DEDEDE] justify-evenly items-center h-[650px]'>
                <CourseCard>
                    <CourseHeading>MA1522</CourseHeading>
                    <ProfileDisplay name='Xan' image='' />
                </CourseCard>
                <CourseCard />
                <CourseCard />
                <CourseCard />
            </div>
        </div>
    )
}

export default courseMatching