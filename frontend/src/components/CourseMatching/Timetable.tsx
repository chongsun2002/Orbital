"use client"
import { NUSModsURLToLessonDays } from "@/lib/courseUtils";
import TimetableRow
 from "./TimetableRow";
import { daysShortform, DaysOfWeek, daysMapping } from "@/lib/constants/courseConstants";
import { TimetableLesson } from "@/lib/types/courseTypes";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LuTrash2 } from "react-icons/lu";
import {  getColorAssignments, resetTimetable } from "@/lib/courseActions";
import DeleteTimetableUserButton from "./DeleteTimetableUserButton";
import EditTimetableUserButton from "./EditTimetableLinkButton";
import { useEffect, useState } from "react";
import { updateUserTimetableColors } from "@/lib/generalActions";

type TimetableProps = {
    NUSModsURLs: {name: string, url: string, isFriend: boolean}[];
    currentUserName?: string;
}

const Timetable: React.FC<TimetableProps> = ({ NUSModsURLs, currentUserName }: TimetableProps) => {
    const [assignments, setAssignments] = useState<Record<string, string>>({});
    const [lessons, setLessons] = useState<{ name: string, isFriend: boolean, lessonsByDay: Record<DaysOfWeek, TimetableLesson[]> }[]>([]);
    
    useEffect(() => {
        const fetchColorAssignments = async () => {
            try {
                updateUserTimetableColors(NUSModsURLs.filter(url => url.name === currentUserName)[0].url)
                const timetableColorAssignments = await getColorAssignments();
                setAssignments(timetableColorAssignments.colorAssignments);
            } catch (error) {
                console.error('Error fetching color assignments:', error);
            }
        };

        fetchColorAssignments();
    }, []);

    useEffect(() => {
        const fetchLessons = async () => {
            const lessonsPromises = NUSModsURLs.map(async (urlNamePair) => {
                const lessonsAndModuleCodes = await NUSModsURLToLessonDays(urlNamePair.url);
                return {
                    name: urlNamePair.name,
                    isFriend: urlNamePair.isFriend,
                    lessonsByDay: lessonsAndModuleCodes.lessonsByDay,
                };
            });

            const lessonsData = await Promise.all(lessonsPromises);
            setLessons(lessonsData);
        };

        fetchLessons();
    }, [NUSModsURLs]);
    
    return (
        <div className="mb-10 mt-[30px] sm:mx-[20px] lg:mx-[80px]">
            <div className="flex flex-row flex-wrap gap-4 mx-[20px] sm:mx-0">
                {lessons.map((lessonsForPerson, personIndex) => {
                    const isFriend = lessonsForPerson.isFriend;
                    const name = lessonsForPerson.name;
                    const badgeStyle = { paddingRight: '0' };
                    return (<Badge key={personIndex} className="mr-2 h-6 bg-gray-300 flex flex-row justify-between" style={badgeStyle} variant="outline">
                        {name}
                        {isFriend ? 
                            (currentUserName !== name ? <DeleteTimetableUserButton name={name} /> 
                                : <EditTimetableUserButton name={name} isCurrentUser={name===currentUserName}/>) 
                            : (
                                <div className="flex flex-row">
                                    <DeleteTimetableUserButton name={name} className="rounded-none "/>
                                    <EditTimetableUserButton name={name} isCurrentUser={false} className="ml-0" />
                                </div>
                            )
                        }
                    </Badge>)
                })}
            </div>
            <form action={resetTimetable} className="mt-4">
                <Button variant="destructive" className="h-6 w-auto px-2 py-1 flex items-center justify-center mx-[20px] sm:mx-0">
                    <div className="flex flex-row items-center">
                        <div>Reset Timetable</div>
                        <LuTrash2 className="w-5 h-4 ml-2" />
                    </div>
                </Button>
            </form>
            {daysShortform.map((day, dayIndex) => {
                return (
                    <div key={dayIndex.toString()} className="mb-2">
                        <div className="text-2xl font-bold text-center">{day}</div>
                        <div className="grid bg-gray-100 rounded-t-md" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
                            {Array.from({ length: 13 }).map((_, index) => (
                                <div key={index} className="h-10 flex items-center text-xs sm:text-md">
                                    {index === 0 ? '' : index < 3 ? `0${8 + index - 1}00` : `${8 + index - 1}00`}
                                </div>
                            ))}
                        </div>
                        {
                            lessons.map((lessonsForPerson, personIndex) => {
                                return (
                                    <TimetableRow 
                                        isLast={personIndex===lessons.length-1}
                                        isEven={personIndex%2===0}
                                        isFirst={personIndex===0}
                                        key={dayIndex.toString()+personIndex.toString()}
                                        name={lessonsForPerson.name} 
                                        lessons={lessonsForPerson.lessonsByDay[daysMapping[day]]}
                                        moduleColorAssignments={assignments}
                                    />
                                )
                            })
                        }
                    </div>
                )
            })}
        </div>
    )
}

export default Timetable;