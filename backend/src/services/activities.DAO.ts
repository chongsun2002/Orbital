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
        return get
    }

    /**
    * This function adds a user to an existing activity as a participant
    * TODO: Check if this updates the User's joined activities as well
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
};