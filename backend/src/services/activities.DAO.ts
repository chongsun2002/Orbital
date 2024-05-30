import { prisma } from '../../index.js'
import type { User, Activity, ActivityCategory, ActivityLocation } from "@prisma/client"

interface ActivityDetails {
    title: string,
    description?: string,
    startTime: Date,
    endTime: Date,
    numOfParticipants: number
    category: string
    location: string
}

interface UpdateActivityDetails {
    title?: string,
    description?: string,
    startTime?: Date,
    endTime?: Date,
    numOfParticipants?: number
    category?: ActivityCategory
    location?: ActivityLocation
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
                category: details.category as ActivityCategory,
                location: details.location as ActivityLocation,
                organiserId: organiserId
            }
        })
        await prisma.user.update({
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
    static async searchActivities(search: string, pageNum: number, category: string | undefined, date: string | undefined, location: string | undefined) : Promise<Activity[]> {
        const where: any = {
            AND: []
        }
        if (category) {
            where.AND.push({
                category: category.toUpperCase() as ActivityCategory
            });
        }

        if (location) {
            where.AND.push({
                location: location.toUpperCase() as ActivityLocation
            });
        }

        const now = new Date();
        if (date) {
            if (date === 'past') {
                where.AND.push({
                    endTime: { lt: now }
                });
            } else if (date === 'future') {
                where.AND.push({
                    startTime: { gt: now }
                });
            } else if (date === 'happening') {
                where.AND.push({
                    startTime: { lte: now },
                    endTime: { gte: now }
                });
            }
        }

        const find = await prisma.activity.findMany({
            where,
            skip: 9 * (pageNum - 1),
            take: 9,
            orderBy: {
                _relevance: {
                    fields: ['title', 'description'],
                    search: search.split(' ').join(' & '),
                    sort: 'desc'
                }
            },
            include: {
                organiser: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return find;
    }

    static async searchActivity(id: string) : Promise<Activity | null> {
        const find = await prisma.activity.findUnique({
            where: {
                id: id,
            },
            include: {
                organiser: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return find;
    }

    static async checkActivityEnrollment(activityId: string, userId: string): Promise<boolean> {
        const find = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                _count: {
                    select: {
                        inActivities: {
                            where: { id: activityId }
                        }
                    }
                }
            }
        })
        return find ? find._count.inActivities > 0 : false;
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
        return update;
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
        return update;
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
        return del;
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
        return find ? find._count.organisedActivities > 0 : false;
    }

    /**
     * This function checks if the activity can still accept more participants. 
     * @param activityId id of the activity
     * @returns true if the activity is not full, false if it is full 
     */
    static async getActivityParticipants(activityId: string) : Promise<string[]> {
        const activity = await prisma.activity.findUnique({ 
            where: {
                id: activityId
            },
            select: {
                participants: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return activity?.participants.map((participant: {name: string}) => participant.name) ?? [];
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
        return participantCount ? participantCount._count.participants < participantCount.numOfParticipants : false;
    }

    static async editActivity(activityId: string, data: UpdateActivityDetails) : Promise<Activity> {
        if (data.location) {
            data.location.toUpperCase() as ActivityLocation
        }
        if (data.category) {
            data.category.toUpperCase() as ActivityLocation
        }
        const update = await prisma.activity.update({
            where: { 
                id: activityId 
            },
            data: data
        })
        return update;
    }

    static async countActivities() : Promise<number> {
        const count = await prisma.activity.count();
        return count;
    }
}