import { NUSMODS_URL } from "./utils";
import { acadYear } from "./constants/courseConstants";

// const dummyData = [
//     {
//     classNo: '12A',
//     startTime: '1200',
//     endTime: '1400',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM1-B112',
//     day: 'Thursday',
//     lessonType: 'Laboratory',
//     size: 30,
//     covidZone: 'A'
//     },
//     {
//     classNo: '10A',
//     startTime: '1000',
//     endTime: '1200',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM1-B112',
//     day: 'Thursday',
//     lessonType: 'Laboratory',
//     size: 30,
//     covidZone: 'A'
//     },
//     {
//     classNo: '10B',
//     startTime: '1000',
//     endTime: '1200',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM1-B109',
//     day: 'Thursday',
//     lessonType: 'Laboratory',
//     size: 30,
//     covidZone: 'A'
//     },
//     {
//     classNo: '1',
//     startTime: '1200',
//     endTime: '1400',
//     weeks: [
//     1, 2, 3, 4, 5, 6,
//     7, 8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'LT15',
//     day: 'Monday',
//     lessonType: 'Lecture',
//     size: 220,
//     covidZone: 'A'
//     },
//     {
//     classNo: '16A',
//     startTime: '1600',
//     endTime: '1800',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM1-B112',
//     day: 'Thursday',
//     lessonType: 'Laboratory',
//     size: 30,
//     covidZone: 'A'
//     },
//     {
//     classNo: '16B',
//     startTime: '1600',
//     endTime: '1800',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM1-B109',
//     day: 'Thursday',
//     lessonType: 'Laboratory',
//     size: 30,
//     covidZone: 'A'
//     },
//     {
//     classNo: '04',
//     startTime: '1300',
//     endTime: '1400',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM3-01-23',
//     day: 'Wednesday',
//     lessonType: 'Recitation',
//     size: 45,
//     covidZone: 'A'
//     },
//     {
//     classNo: '02',
//     startTime: '1100',
//     endTime: '1200',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM3-01-23',
//     day: 'Wednesday',
//     lessonType: 'Recitation',
//     size: 45,
//     covidZone: 'A'
//     },
//     {
//     classNo: '03',
//     startTime: '1200',
//     endTime: '1300',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM3-01-23',
//     day: 'Wednesday',
//     lessonType: 'Recitation',
//     size: 45,
//     covidZone: 'A'
//     },
//     {
//     classNo: '05',
//     startTime: '1400',
//     endTime: '1500',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM3-01-23',
//     day: 'Wednesday',
//     lessonType: 'Recitation',
//     size: 45,
//     covidZone: 'A'
//     },
//     {
//     classNo: '06',
//     startTime: '1500',
//     endTime: '1600',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM3-01-23',
//     day: 'Wednesday',
//     lessonType: 'Recitation',
//     size: 45,
//     covidZone: 'A'
//     },
//     {
//     classNo: '12B',
//     startTime: '1200',
//     endTime: '1400',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM1-B109',
//     day: 'Thursday',
//     lessonType: 'Laboratory',
//     size: 30,
//     covidZone: 'A'
//     },
//     {
//     classNo: '14A',
//     startTime: '1400',
//     endTime: '1600',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM1-B112',
//     day: 'Thursday',
//     lessonType: 'Laboratory',
//     size: 30,
//     covidZone: 'A'
//     },
//     {
//     classNo: '01',
//     startTime: '1000',
//     endTime: '1100',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM3-01-23',
//     day: 'Wednesday',
//     lessonType: 'Recitation',
//     size: 45,
//     covidZone: 'A'
//     },
//     {
//     classNo: '14B',
//     startTime: '1400',
//     endTime: '1600',
//     weeks: [
//     3, 4, 5, 6, 7,
//     8, 9, 10, 11, 12,
//     13
//     ],
//     venue: 'COM1-B109',
//     day: 'Thursday',
//     lessonType: 'Laboratory',
//     size: 30,
//     covidZone: 'A'
//     }
//     ]

export async function getCourseData(moduleCode: string) {
    const url = new URL(`${acadYear}/modules/${moduleCode}.json`, NUSMODS_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        next: {
            revalidate: 604800
        }
    })
    if (!response.ok) {
        throw new Error("Could not reach nusmods server");
    }
    return response.json();
    // return dummyData;
}
