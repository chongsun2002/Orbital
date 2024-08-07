import { TimetableLesson } from "@/lib/types/courseTypes";
import TimetableCell from "./TimetableCell";

type TimetableRowProps = {
    isEven: boolean;
    isFirst: boolean;
    isLast: boolean;
    name: string;
    lessons: TimetableLesson[];
    moduleColorAssignments: Record<string, string>;
}

const TimetableRow: React.FC<TimetableRowProps> = ({ isEven, isFirst, isLast, name, lessons, moduleColorAssignments }: TimetableRowProps) => {

    // To render the grid cells and make them different color, similar to the NUSMods interface.
    const gridCells = Array.from({ length: 13 }, (_, index) => {
        const lesson = lessons.find(lesson => {
            const startIndex = parseInt(lesson.startTime.substring(0, 2), 10) - 8;
            return startIndex === index;
        });

        const getCellBackgroundClass = (index: number) => {
            if (isEven) {
                return index % 2 === 0 ? 'bg-gray-100' : 'bg-white';
            } else {
                return index % 2 === 0 ? 'bg-white' : 'bg-gray';
            }
        };

        return (
            <div
                key={index}
                className={`flex flex-col justify-center text-sm truncate ${getCellBackgroundClass(index)}`}
                style={{ gridColumn: index + 2 }}
            >
                {lesson ? (
                    <TimetableCell
                        startIndex={parseInt(lesson.startTime.substring(0, 2), 10) - 8}
                        endIndex={parseInt(lesson.endTime.substring(0, 2), 10) - 8}
                        lesson={lesson}
                        color={moduleColorAssignments[lesson.moduleCode]}
                    />
                ) : null}
            </div>
        );
    });
    
    return (
        <div className="grid bg-gray-100" style={{ 
            gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
            borderRight: '1px solid #e0e0e0',
            borderLeft: '1px solid #e0e0e0',
            ...(isFirst && { borderTop: '1px solid #e0e0e0' }),
            ...(isLast && {borderBottom: '1px solid #e0e0e0'})
        }}>
            <div className="h-16 flex flex-col justify-center col-span-1 border-solid border-r-[1px] border-[#e5e7eb] text-sm font-semibold truncate pl-2 bg-blue-50" style={{
                ...(!isLast && { borderBottom: '1px solid #e5e7eb' })
            }}>
                {name}
            </div>
            {/* {lessons.slice().sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime)).map((lesson, index) => {
                const startIndex = parseInt(lesson.startTime.substring(0, 2), 10) - 8;
                const endIndex = parseInt(lesson.endTime.substring(0, 2), 10) - 8;
                const color = moduleColorAssignments[lesson.moduleCode];
                return (<TimetableCell key={index} startIndex={startIndex} endIndex={endIndex} lesson={lesson} color={color}></TimetableCell>)
            })} */}
            {gridCells}
        </div>
    )
}

export default TimetableRow;