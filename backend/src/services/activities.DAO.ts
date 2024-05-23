import { prisma } from '../../index.js'
import type { User, Activity } from "@prisma/client"

interface ActivityDetails {
    title: string,
    description?: string,
    startTime: Date,
    endTime: Date,
    numOfParticipants: number
}

export default class ActivitiesDAO {
    /**
     * This function creates an activity in the database and links it to the user who created it
     */
    static async createActivity(details: ActivityDetails, organiserId: string) : Promise<Activity> {
        const activity = await prisma.activity.create({
            data: {
                title: details.title,
                description: details.description,
                startTime: details.startTime,
                endTime: details.endTime,
                numOfParticipants: details.numOfParticipants,
                organiserId: organiserId 
            }
        })
        const user = await prisma.user.update({
            where: {
                id: organiserId
            },
            data: {
                organisedActivities: {
                    connect: {
                        id: activity.id
                    }
                }
            },
            include: {
                organisedActivities: true
            }
        })
        return activity;
    }

    /**
     * Returns the activity given by its id
     */
    static async getActivity(activityId: string) : Promise<Activity | null> {
        const get: Activity | null  = await prisma.activity.findUnique({ 
            where: {
                id: activityId
            }
        })
        return get;
    }

    /**
     * This function allows searches for activities with the specified string in the title and then applies pagination
     */
    static async searchActivity(search: string, pageNum: number) : Promise<Activity> {
        const find = await prisma.activity.findMany({
            skip: 9 * (pageNum - 1),
            take: 9,
            orderBy: {
                _relevance: {
                    fields: ['title', 'description'],
                    search: search.split(' ').join(' & '),
                    sort: 'desc'
                }
            }
        })
        return find;
    }

    /**
     * This function displays all activities, paginated, without a search input 
     * @param pageNum The page number that the user is on 
     */
    static async displayActivities(pageNum: number) : Promise<Activity> {
        const all = await prisma.activity.findMany({
            skip: 9 * (pageNum - 1),
            take: 9
        })
        return all;
    }

    /**
    * This function adds a user to an existing activity as a participant
    * TODO: Check if this updates the User's joined activities as well
    */
    static async addParticipant(activityId: string, userId: string) : Promise<Activity | void> {
        const update = await prisma.activity.update({
            where: {
                id: activityId
            },
            data : {
                participants: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    }

    /**
     * This function removes a user from an existing activity as a participant
     */
    static async removeParticipant(activityId: string, userId: string) : Promise<Activity> {
        const update = await prisma.activity.update({
            where: {
                id: activityId
            },
            data : {
                participants: {
                    disconnect: {
                        id: userId
                    }
                }
            }
        })
        return update
    }

    /**
     * This function allows an organiser to delete their activity
     * TODO: Check if this deletes the activity from the User as well
     */
    static async deleteActivity(activityId: string) : Promise<Activity> {
        const del = await prisma.activity.delete({
            where: {
                id: activityId
            }
        })
        return del
    }

    /**
     * This function checks if the user with the specified user id is the creator and organiser of the activity. 
     * @param activityId id of the activity
     * @param userId id of the user 
     * @returns true if the user is the creator of the activity, false otherwise 
     */
    static async checkIfOwner(activityId: string, userId: string): Promise<boolean> {
        const find = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                _count: {
                    select: {
                        organisedActivities: {
                            where: { id: activityId }
                        }
                    }
                }
            }
        })
        return find._count.organisedActivities > 0;
    }

    /**
     * This function checks if the activity can still accept more participants. 
     * @param activityId id of the activity
     * @returns true if the activity is not full, false if it is full 
     */
    static async countParticipants(activityId: string) : Promise<boolean> {
        const participantCount = await prisma.activity.findUnique({ 
            where: {
                id: activityId
            },
            select: {
                _count: {
                    select: {
                        participants: true
                    }
                },
                numOfParticipants: true
            }
        }) 
        return participantCount._count.participants < participantCount.numOfParticipants;
    }
}