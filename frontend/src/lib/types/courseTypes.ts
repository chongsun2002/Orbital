export type Lesson = {
    classNo: string;
    startTime: string;
    endTime: string;
    weeks: number[];
    venue: string;
    day: string;
    lessonType: string;
    size: number;
    covidZone?: string;
}

export type CourseSelection = {
  [lessonType: string]: string;
}

export type ParsedResult = {
  [moduleCode: string]: CourseSelection;
}

export type RawLesson = Readonly<{
    classNo: string;
    day: string;
    endTime: string;
    lessonType: string;
    startTime: string;
    venue: string;
    weeks: number[];
    size: number;
    covidZone: string;
  }>;

export type TimetableLesson = RawLesson & {
    moduleCode: string;
}