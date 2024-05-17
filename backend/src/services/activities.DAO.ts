import { prisma } from '../../index.js'
import type { User, Activity } from "@prisma/client"
import AuthDAO from './authDAO.js'

interface ActivityDetails {
    organiserId: string,
    title: string,
    description?: string,
    startTime: Date,
    endTime: Date,
    numOfParticipants: number
}

export default class ActivitiesDAO {
    /**
     * This function creates an acitvity in the database
     */
    static async createActivity(details: ActivityDetails) : Promise<Activity> {
        const activity: Activity = await prisma.activity.create({data: {
            title: details.title,
            description: details.description,
            startTime: details.startTime,
            endTime: details.endTime,
            organiserId: details.organiserId,
            numOfParticipants: details.numOfParticipants
        }});
        return activity;
    }

    /**
    * This function checks if the user exists in the database. If the user exists returns the user.
    * Else it throws the following exception: 
    * @throws {PrismaClientKnownRequestError}
    */
    static async addParticipant(activityId: string, user: User) : Promise<Activity> {
        const update = await prisma.activity.update({
            where: {
                id: activityId
            },
            data : {
                participants: {
                    push: user
                }
            }
        });
        return update;
    }
};