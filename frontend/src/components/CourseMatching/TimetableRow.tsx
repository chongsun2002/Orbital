import { TimetableLesson } from "@/lib/types/courseTypes";
import TimetableCell from "./TimetableCell";

type TimetableRowProps = {
    isFirst: boolean;
    name: string;
    lessons: TimetableLesson[];
    moduleColorAssignments: Record<string, string>;
}

const TimetableRow: React.FC<TimetableRowProps> = ({ isFirst, name, lessons, moduleColorAssignments }: TimetableRowProps) => {
    return (
        <div className="grid bg-gray-100" style={{ 
            gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
            borderBottom: '1px solid #e0e0e0',
            borderRight: '1px solid #e0e0e0',
            ...(isFirst && { borderTop: '1px solid #e0e0e0' }),
        }}>
            <div className="h-16 border-x flex flex-col justify-center col-span-1 text-sm font-semibold truncate pl-2">
                {name}
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