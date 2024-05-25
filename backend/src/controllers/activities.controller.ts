import ActivitiesDAO from "../services/activities.DAO.js";
import { User, Activity } from "@prisma/client";
import { RequestHandler } from "express";

export default class ActivitiesController {
    /**
     * This function allows the suer to create an activity with the specified details.
     * @returns The created activity 
     */
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

    /**
     * This function allows the user to search for activities with a specified search string
     * @returns The activities which match the search string 
     */
    static apiSearchActivities: RequestHandler = async (req, res, next) => {
        const rawSearch: any = req.query.search;
        const rawPageNum: any = req.query.pageNum;
        const searchString: string = typeof rawSearch === 'string' ? rawSearch : "";
        const pageNum: number = typeof rawPageNum === 'string' ? parseInt(rawPageNum, 10) : 1;
        
        try {
            const activities: Activity[] = await ActivitiesDAO.searchActivities(searchString, pageNum);
            res.status(200).json({activities: activities});            
            return;
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiSearchActivity: RequestHandler = async (req, res, next) => {
        const rawId: any = req.query.id;
        const id: string = typeof rawId === 'string' ? rawId : "";
        try {
            const activity: Activity = await ActivitiesDAO.searchActivity(id);
            if (!activity) {
                res.status(404).json({error: "Could not find activity in database."});
            } else {
                res.status(200).json({activity: activity});
            }
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

    static apiDisplayActivities: RequestHandler = async (req, res, next) => {
        const pageNum: number = req.body.pageNum;
        try {
            const activities: Activity = await ActivitiesDAO.displayActivities(pageNum);
            res.status(200).json({activities: activities});
            return;
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }
}