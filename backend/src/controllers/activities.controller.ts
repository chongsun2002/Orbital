import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import ActivitiesDAO from "../services/activities.DAO.js";
import { User, Activity } from "@prisma/client";
import { RequestHandler  } from "express";

export default class ActivitiesController {
    static apiCreateActivity : RequestHandler = async (req, res, next) => {
        const title = req.body.title
        const description = req.body.description
        const startTime = req.body.startTime
        const endTime = req.body.endTime
        const numOfParticipants = req.body.numOfParticipants

        const user: User = req.user;
        try {
            const activity: Activity = await ActivitiesDAO.createActivity({
                title: title,
                description: description,
                startTime: startTime,
                endTime: endTime,
                numOfParticipants: numOfParticipants
            }, user.id)
            res.status(200).json({activityId: activity.id})
            return
        } catch (error) {
            console.error('Unexpected error creating activity')
            res.status(500).json({error: (error as Error).message})
            return
        } 
    }


}