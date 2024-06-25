import { TimetableLesson } from "@/lib/types/courseTypes";

type TimetableCellProps = {
    startIndex: number;
    endIndex: number;
    lesson: TimetableLesson;
    color: string;
}

const TimetableCell: React.FC<TimetableCellProps> = ({startIndex, endIndex, lesson, color}: TimetableCellProps) => {

    return (
        <div
            className="flex flex-col rounded-sm"
            style={{
                gridColumnStart: startIndex + 2,
                gridColumnEnd: endIndex + 2,
                margin: '1.5px',
                backgroundColor: color,
            }}
        >
            <div className="p-1">
                <h1 className='text-xs font-semibold'>{lesson.moduleCode}</h1>
                <div className='text-xs'>{lesson.lessonType}</div>
                <div className='text-xs'>{lesson.venue || "E-Learn"}</div>
            </div>
        </div>
    )
}

export default TimetableCell;