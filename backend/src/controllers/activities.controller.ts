import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import ActivitiesDAO from "../services/activities.DAO.js";
import { User, Activity } from "@prisma/client";
import { RequestHandler  } from "express";
import { prisma } from "../../index.js";

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
            console.error(`Unexpected error creating activity ${error}`)
            res.status(500).json({error: (error as Error).message})
            return
        } 
    }

    static apiSearchActivity: RequestHandler = async (req, res, next) => {
        const searchString: string = req.body.searchString;
        const pageNum: number = req.body.pageNum;

        try {
            const activity: Activity = await ActivitiesDAO.searchActivity(searchString, pageNum);
            res.status(200).json({activities: activity});            
            return;
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiAddParticipant: RequestHandler = async (req, res, next) => {
        const activityId: string = req.body.activityId;
        const user: User = req.user;
        if (!(await ActivitiesDAO.countParticipants(activityId))) {
            console.error("Activity is full!");
            res.status(406).json({error: "Activity is full!"});
            return;
        }
        try {
            const activity: Activity = await ActivitiesDAO.addParticipant(activityId, user.id);
            res.status(200).json({activities: activity});            
            return;
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`)
            res.status(500).json({error: (error as Error).message})
            return;
        }
    }

    static apiRemoveParticipant: RequestHandler = async (req, res, next) => {
        const activityId: string = req.body.activityId;
        const user: User = req.user;
        try {
            const activity: Activity = await ActivitiesDAO.removeParticipant(activityId, user.id);
            res.status(200).json({activities: activity});            
            return;
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiDeleteActivity: RequestHandler = async (req, res, next) => {
        const activityId: string = req.body.activityId;
        const user: User = req.user;
        if (!(await ActivitiesDAO.checkIfOwner(activityId, user.id))) {
            console.error("User is not the creator of this activity");
            res.status(403).json({error: "User is not the creator of this activity"});
            return;
        }    
        try {
            const activity: Activity = await ActivitiesDAO.deleteActivity(activityId);
            res.status(200).json({activities: activity});            
            return;
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }
}