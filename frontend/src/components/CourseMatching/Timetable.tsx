import { NUSModsURLToLessonDays, assignColorsToModules } from "@/lib/courseUtils";
import TimetableRow
 from "./TimetableRow";
import { daysShortform, DaysOfWeek, daysMapping } from "@/lib/constants/courseConstants";
import { TimetableLesson } from "@/lib/types/courseTypes";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LuTrash2 } from "react-icons/lu";
import { deleteNUSModsURL, getColorAssignments, resetTimetable, setColorAssignments } from "@/lib/courseActions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

type TimetableProps = {
    NUSModsURLs: {name: string, url: string}[];
}

const Timetable: React.FC<TimetableProps> = async ({ NUSModsURLs }: TimetableProps) => {
    const timetableColorAssignments = await getColorAssignments();
    const assignments = timetableColorAssignments.colorAssignments;
    const promises = NUSModsURLs.map(async (urlNamePair) => {
        const lessonsAndModuleCodes = await NUSModsURLToLessonDays(urlNamePair.url);
        return {
            name: urlNamePair.name,
            lessonsByDay: lessonsAndModuleCodes.lessonsByDay,
        };
    });
    const lessons: { name: string, lessonsByDay: Record<DaysOfWeek, TimetableLesson[]> }[] = await Promise.all(promises);
    const session = cookies().get('session')?.value;
    const currentUserName = session ? JSON.parse(session).name : "";

    return (
        <div className="mb-10 mt-[30px] sm:mx-[20px] lg:mx-[80px]">
            <div className="flex flex-row flex-wrap mx-[20px] sm:mx-0">
                {lessons.map((lessonsForPerson, personIndex) => {
                    const name = lessonsForPerson.name;
                    const badgeStyle = currentUserName === name ? { padding: '0.625rem' } : { paddingRight: '0' };
                    return (<Badge key={personIndex} className="mr-2 h-6 bg-gray-300 flex flex-row justify-between" style={badgeStyle} variant="outline">
                        {name}
                        {currentUserName !== name ? (<form action={async () => {
                            "use server"
                            await deleteNUSModsURL(name);
                            redirect("/course_matching");
                        }}>
                            <Button variant="destructive" className="h-6 w-auto px-1 py-1 ml-5 flex items-center justify-center rounded-l-none rounded-r-full">
                                <LuTrash2 className="w-6 h-4" />
                            </Button>
                        </form>) : null}
                    </Badge>)
                })}
            </div>
            <form action={async () => {
                "use server"
                await resetTimetable();
                redirect("/course_matching");
            }} className="mt-2">
                <Button variant="destructive" className="h-6 w-auto px-2 py-1 flex items-center justify-center mx-[20px] sm:mx-0">
                    <div className="flex flex-row items-center">
                        <div>Reset Timetable</div>
                        <LuTrash2 className="w-5 h-4 ml-2" />
                    </div>
                </Button>
            </form>
            {daysShortform.map((day, dayIndex) => {
                return (
                    <div key={dayIndex.toString()} className="mb-2">
                        <div className="text-2xl font-bold text-center">{day}</div>
                        <div className="grid bg-gray-100 rounded-t-md" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
                            {Array.from({ length: 13 }).map((_, index) => (
                                <div key={index} className="h-10 flex items-center text-xs sm:text-md">
                                    {index === 0 ? '' : index < 3 ? `0${8 + index - 1}00` : `${8 + index - 1}00`}
                                </div>
                            ))}
                        </div>
                        {
                            lessons.map((lessonsForPerson, personIndex) => {
                                return (
                                    <TimetableRow 
                                        isLast={personIndex===lessons.length-1}
                                        isEven={personIndex%2===0}
                                        isFirst={personIndex===0}
                                        key={dayIndex.toString()+personIndex.toString()}
                                        name={lessonsForPerson.name} 
                                        lessons={lessonsForPerson.lessonsByDay[daysMapping[day]]}
                                        moduleColorAssignments={assignments}
                                    />
                                )
                            })
                        }
                    </div>
                )
            })}
        </div>
    )
}

export default Timetable;