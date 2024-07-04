import { TimetableLesson } from "@/lib/types/courseTypes";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type TimetableCellProps = {
    startIndex: number;
    endIndex: number;
    lesson: TimetableLesson;
    color: string;
}

const TimetableCell: React.FC<TimetableCellProps> = ({startIndex, endIndex, lesson, color}: TimetableCellProps) => {

    return (
        <div
            className="flex flex-col justify-center h-full rounded-sm"
            style={{
                gridColumnStart: startIndex + 2,
                gridColumnEnd: endIndex + 2,
                margin: '2px',
                backgroundColor: color,
            }}
        >
            <Dialog>
                <DialogTrigger>
                    <Button  className="p-1 text-black flex flex-col items-start h-full bg-inherit hover:bg-inherit hover:opacity-60">
                        <h1 className='text-xs font-semibold overflow-hidden'>{lesson.moduleCode}</h1>
                        <div className='text-xs overflow-hidden'>{lesson.lessonType}</div>
                        <div className='text-xs overflow-hidden'>{lesson.venue || "E-Learn"}</div>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {lesson.moduleCode}
                        </DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default TimetableCell;