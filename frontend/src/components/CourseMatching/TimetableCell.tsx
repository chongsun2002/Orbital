import { TimetableLesson } from "@/lib/types/courseTypes";
import { LuChevronsDown } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import TimetableCellDetails from "./TimetableCellDetails";

type TimetableCellProps = {
    startIndex: number;
    endIndex: number;
    lesson: TimetableLesson;
    color: string;
    style?: React.CSSProperties;
}

const TimetableCell: React.FC<TimetableCellProps> = ({startIndex, endIndex, lesson, color, style}: TimetableCellProps) => {
    return (
        <div
            className="h-full"
            style={{
                ...style,
                padding: '2px',
            }}
        >
            <div
                className="flex flex-col justify-center h-full rounded-sm"
                style={{
                    backgroundColor: color, // Background color applied to the inner wrapper
                    height: '100%'
                }}
            >
                <Dialog>
                    <DialogTrigger>
                        <div className="p-1 text-black flex flex-col items-start h-full bg-inherit hover:bg-inherit hover:opacity-60">
                            <h1 className='text-xs font-semibold overflow-hidden'>{lesson.moduleCode}</h1>
                            <div className='text-xs overflow-hidden'>{lesson.lessonType}</div>
                            <div className='text-xs overflow-hidden'>{lesson.venue || "E-Learn"}</div>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight first:mt-0">
                                    {lesson.moduleCode}
                                </h2>
                                <h3 className="scroll-m-20 text-xl pb-2 font-semibold tracking-tight border-b ">
                                    {lesson.title}
                                </h3>
                            </DialogTitle>
                            <DialogDescription>
                                <TimetableCellDetails header="Lesson" content={lesson.lessonType + " " + lesson.classNo} />
                                <TimetableCellDetails header="Venue" content={lesson.venue} />
                                <TimetableCellDetails header="Day" content={lesson.day} />
                                <TimetableCellDetails header="Start Time" content={lesson.startTime + "hrs"} />
                                <TimetableCellDetails header="End Time" content={lesson.endTime + "hrs"} />
                                <TimetableCellDetails header="Weeks" content={lesson.weeks.join(', ')} />
                                
                                <Collapsible className="mt-4">
                                    <CollapsibleTrigger className="flex flex-row items-center">
                                        <div className="scroll-m-20 text-base font-semibold tracking-tight">Course Description</div>
                                        <LuChevronsDown />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="text-black">
                                            {lesson.description}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default TimetableCell;