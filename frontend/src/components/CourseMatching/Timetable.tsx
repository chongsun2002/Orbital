import { NUSModsURLToLessonDays, assignColorsToModules } from "@/lib/courseUtils";
import TimetableRow
 from "./TimetableRow";
import { daysShortform, DaysOfWeek, daysMapping } from "@/lib/constants/courseConstants";
import { TimetableLesson } from "@/lib/types/courseTypes";

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
    return (
        <div className="bg-gray-100 mb-10 mx-[80px] mt-[30px]">
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
                {Array.from({ length: 13 }).map((_, index) => (
                    <div key={index} className="h-10 border-b flex items-center">
                    {index === 0 ? '' : `${8 + index - 1}:00`}
                    </div>
                ))}
            </div>
            {daysShortform.map((day, dayIndex) => {
                return lessons.map((lessonsForPerson, personIndex) => {
                    return (
                        <TimetableRow 
                            key={dayIndex.toString()+personIndex.toString()}
                            day={day}
                            name={lessonsForPerson.name} 
                            lessons={lessonsForPerson.lessonsByDay[daysMapping[day]]}
                            moduleColorAssignments={moduleCodesColors}
                        />
                    )
                })
            })}
        </div>
    )
}

export default Timetable;