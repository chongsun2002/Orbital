import { NUSModsURLToLessonDays, assignColorsToModules } from "@/lib/courseUtils";
import TimetableRow
 from "./TimetableRow";
import { daysShortform, DaysOfWeek, daysMapping } from "@/lib/constants/courseConstants";
import { TimetableLesson } from "@/lib/types/courseTypes";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LuTrash2 } from "react-icons/lu";
import { deleteNUSModsURL } from "@/lib/courseActions";
import { redirect, useRouter } from "next/navigation";
import { cookies } from "next/headers";

type TimetableProps = {
    NUSModsURLs: {name: string, url: string}[];
}

const Timetable: React.FC<TimetableProps> = async ({ NUSModsURLs }: TimetableProps) => {
    const lessons: { name: string, lessonsByDay: Record<DaysOfWeek, TimetableLesson[]> }[] = [];
    const moduleCodes: Set<string> = new Set();
    await Promise.all(NUSModsURLs.map(async urlNamePair => {
        const lessonsAndModuleCodes: { lessonsByDay: Record<DaysOfWeek, TimetableLesson[]>, moduleCodes: Set<string> } = await NUSModsURLToLessonDays(urlNamePair.url);
        lessonsAndModuleCodes.moduleCodes.forEach(moduleCodes.add, moduleCodes);
        lessons.push({
            name: urlNamePair.name,
            lessonsByDay: lessonsAndModuleCodes.lessonsByDay,
        })
    }))
    const moduleCodesColors = assignColorsToModules(moduleCodes);
    const session = cookies().get('session')?.value;
    const currentUserName = session ? JSON.parse(session).name : "";

    return (
        <div className="mb-10 mx-[80px] mt-[30px]">
            <div className="flex flex-row flex-wrap">
                {lessons.map((lessonsForPerson, personIndex) => {
                    const name = lessonsForPerson.name;
                    return (<Badge key={personIndex} className="mr-2 bg-gray-300" variant="outline">
                        {name}
                        {currentUserName !== name ? (<form action={async () => {
                            "use server"
                            await deleteNUSModsURL(name);
                            redirect("/course_matching");
                        }}>
                            <Button variant="destructive" className="h-6 w-auto px-2 py-1 ml-4 flex items-center justify-center">
                                <LuTrash2 className="w-5 h-4" />
                            </Button>
                        </form>) : null}
                    </Badge>)
                })}
            </div>
            {daysShortform.map((day, dayIndex) => {
                return (
                    <div key={dayIndex.toString()} className="mb-2">
                        <div className="text-2xl font-bold text-center">{day}</div>
                        <div className="grid bg-gray-100" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
                            {Array.from({ length: 13 }).map((_, index) => (
                                <div key={index} className="h-10 flex items-center">
                                {index === 0 ? '' : index < 3 ? `0${8 + index - 1}00` : `${8 + index - 1}00`}
                                </div>
                            ))}
                        </div>
                        {
                            lessons.map((lessonsForPerson, personIndex) => {
                                return (
                                    <TimetableRow 
                                        isFirst={personIndex===0}
                                        key={dayIndex.toString()+personIndex.toString()}
                                        name={lessonsForPerson.name} 
                                        lessons={lessonsForPerson.lessonsByDay[daysMapping[day]]}
                                        moduleColorAssignments={moduleCodesColors}
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