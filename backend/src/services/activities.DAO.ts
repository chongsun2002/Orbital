import { prisma } from '../../index.js'
import type { User, Activity } from "@prisma/client"
import AuthDAO from './authDAO.js'

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
    static async createActivity(details: ActivityDetails, organiserId: string) : Promise<User> {
        const result = await prisma.user.update({
            where: {
                id: organiserId
            },
            data: {
                organisedActivities: {
                    create: {
                        title: details.title,
                        description: details.description,
                        startTime: details.startTime,
                        endTime: details.endTime,
                        numOfParticipants: details.numOfParticipants
                    }
                }
            }
        })
        return result;
    }

    /**
    * This function adds a user to an existing activity as a participant
    */
    static async addParticipant(activityId: string, userId: string) : Promise<Activity> {
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
        return update
    }
};