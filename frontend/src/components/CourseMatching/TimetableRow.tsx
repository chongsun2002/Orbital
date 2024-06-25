import { TimetableLesson } from "@/lib/types/courseTypes";
import TimetableCell from "./TimetableCell";

type TimetableRowProps = {
    name: string;
    day: string;
    lessons: TimetableLesson[];
    moduleColorAssignments: Record<string, string>;
}

const TimetableRow: React.FC<TimetableRowProps> = ({ name, day, lessons, moduleColorAssignments }: TimetableRowProps) => {
    return (
        <div className="grid" style={{ 
            gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
            borderBottom: '1px solid #e0e0e0'
        }}>

            <div className="h-16 border-b flex flex-col items-center justify-center col-span-1">
                <div className="text-sm font-semibold">{name}</div>
                <div className="text-sm">{day}</div>
            </div>
            {lessons.slice().sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime)).map((lesson, index) => {
                const startIndex = parseInt(lesson.startTime.substring(0, 2), 10) - 8;
                const endIndex = parseInt(lesson.endTime.substring(0, 2), 10) - 8;
                const color = moduleColorAssignments[lesson.moduleCode];
                return (<TimetableCell key={index} startIndex={startIndex} endIndex={endIndex} lesson={lesson} color={color}></TimetableCell>)
            })}
        </div>
    )
}

export default TimetableRow;