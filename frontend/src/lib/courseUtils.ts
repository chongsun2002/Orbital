import { DaysOfWeek, currentSemester } from "./constants/courseConstants";
import { getCourseData } from "./courseActions";
import { CourseSelection, ParsedResult, RawLesson, TimetableLesson } from "./types/courseTypes";

export const parseNUSModsURL = (NUSModsURL: string): ParsedResult => {
    const modules = new URLSearchParams(NUSModsURL.split('?')[1]);
    const parsedResult: ParsedResult = {};
    modules.forEach((value, key) => {
        const moduleLessons: CourseSelection = {};
        const lessons = value.split(',');
        lessons.forEach(lesson => {
            const [type, index] = lesson.split(':');
            moduleLessons[type] = index;
        })
        parsedResult[key] = moduleLessons;
    })
    return parsedResult;
}

export const NUSModsURLToLessonDays = async (NUSModsURL: string): Promise<{ lessonsByDay: Record<DaysOfWeek, TimetableLesson[]>, moduleCodes: Set<string>}> => {
    const lessonsByDay: Record<DaysOfWeek, TimetableLesson[]> = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
    }
    const lessons: ParsedResult = parseNUSModsURL(NUSModsURL);
    const moduleCodesSet: Set<string> = new Set();
    for (const [moduleCode, selectedClasses] of Object.entries(lessons)) {
        moduleCodesSet.add(moduleCode);
        let lessonData = await getCourseData(moduleCode);
        lessonData.semesterData = lessonData.semesterData.map((semester: any) => ({
            ...semester,
            timetable: semester.timetable.map((lesson: any) => ({
                ...lesson,
                title: lessonData.title,
                description: lessonData.description,
            }))
        }));
        lessonData = lessonData.semesterData;
        if (lessonData.length === 1) {
            lessonData = lessonData[0].timetable;
        } else if (lessonData.length === 2) {
            lessonData = lessonData[currentSemester-1].timetable;
        } else {
            lessonData = [];
        }
        Object.entries(selectedClasses as object).forEach(([lessonType, classNo]) => {
            const matchingLessons: RawLesson[] = lessonData.filter((lesson: RawLesson) => {
                return lesson.lessonType.toUpperCase().startsWith(lessonType.toUpperCase()) && lesson.classNo === classNo;
            })
            matchingLessons.forEach(matchingLesson => {
                lessonsByDay[matchingLesson.day as DaysOfWeek].push({
                    ...matchingLesson,
                    moduleCode,
                });
            });
        })
    }
    return { 
        lessonsByDay: lessonsByDay,
        moduleCodes: moduleCodesSet,
    }
}

const generateColorPalette = (): string[] => {
    return [
        '#1F77B4', // Dark Blue
        '#FF7F0E', // Dark Orange
        '#2CA02C', // Dark Green
        '#D62728', // Dark Red
        '#9467BD', // Purple
        '#8C564B', // Brown
        '#E377C2', // Pink
        '#7F7F7F', // Dark Gray
    ];
};

export const assignColorsToModules = (moduleCodes: Set<string>): Record<string, string> => {
    const colors = generateColorPalette();
    const moduleColors: Record<string, string> = {};
    Array.from(moduleCodes).forEach((moduleCode, index) => {
        moduleColors[moduleCode] = colors[index % colors.length];
    });
    return moduleColors;
}

