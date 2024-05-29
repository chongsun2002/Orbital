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
        const category: string = req.body.category
        const location: string = req.body.location
        const user: User = req.user;
        try {
            const activity: Activity = await ActivitiesDAO.createActivity({
                title: title,
                description: description,
                startTime: startTime,
                endTime: endTime,
                numOfParticipants: numOfParticipants,
                location: location?location.toUpperCase():location,
                category: category?category.toUpperCase():category
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
        const rawCategory: any = req.query.category;
        const rawDate: any = req.query.date;
        const rawLocation: any = req.query.location;
        const searchString: string = typeof rawSearch === 'string' ? rawSearch : "";
        const pageNum: number = typeof rawPageNum === 'string' ? parseInt(rawPageNum, 10) : 1;
        const category: string | undefined = typeof rawCategory === 'string' ? rawCategory : undefined;
        const location: string | undefined = typeof rawLocation === 'string' ? rawLocation : undefined;
        const date: string | undefined = typeof rawDate === 'string' ? rawDate : undefined;
        
        try {
            const activities: Activity[] = await ActivitiesDAO.searchActivities(searchString, pageNum,category, date, location);
            res.status(200).json({activities: activities});            
            return;
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiSearchActivity: RequestHandler = async (req, res, next) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        try {
            const activity: Activity | null = await ActivitiesDAO.searchActivity(activityId);
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
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: User = req.user;
        if (!(await ActivitiesDAO.countParticipants(activityId))) {
            console.error("Activity is full!");
            res.status(406).json({error: "Activity is full!"});
            return;
        }
        try {
            const activity: Activity = await ActivitiesDAO.addParticipant(activityId, user.id);
            res.status(200).json({activity: activity});            
            return;
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`)
            res.status(500).json({error: (error as Error).message})
            return;
        }
    }

    static apiRemoveParticipant: RequestHandler = async (req, res, next) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: User = req.user;
        try {
            const activity: Activity = await ActivitiesDAO.removeParticipant(activityId, user.id);
            res.status(200).json({activity: activity});            
            return;
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiCheckActivityEnrollment: RequestHandler = async (req, res, next) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: User = req.user;
        try {
            const isEnrolled: Boolean = await ActivitiesDAO.checkActivityEnrollment(activityId, user.id);
            res.status(200).json({enrolled: isEnrolled});
            return;
        } catch (error) {
            console.error(`Unexpected error checking activity enrollment ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiGetActivityParticipants: RequestHandler = async (req, res, next) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        try {
            const enrolledNames: string[] = await ActivitiesDAO.getActivityParticipants(activityId);
            res.status(200).json({enrolledNames: enrolledNames});
            return;
        } catch (error) {
            console.error(`Unexpected error getting enrolled users ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiCheckActivitiesEnrolled: RequestHandler = async (req, res, next) => {
        // TODO
    }

    static apiCheckIsOrganiser: RequestHandler = async (req, res, next) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: User = req.user;
        try {
            const isOwner: boolean = await ActivitiesDAO.checkIfOwner(activityId, user.id);
            res.status(200).json({isOwner: isOwner});
            return;
        } catch (error) {
            res.status(500).json({error: (error as Error).message});
            return;
        }
     }

    static apiDeleteActivity: RequestHandler = async (req, res, next) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: User = req.user;
        if (!(await ActivitiesDAO.checkIfOwner(activityId, user.id))) {
            console.error("User is not the creator of this activity");
            res.status(403).json({error: "User is not the creator of this activity"});
            return;
        }    
        try {
            const activity: Activity = await ActivitiesDAO.deleteActivity(activityId);
            res.status(200).json({activity: activity});            
            return;
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiEditActivity: RequestHandler = async (req, res, next) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: User = req.user;
        try {
            const activity: Activity = await ActivitiesDAO.editActivity(activityId, req.body);
            res.status(200).json({activity: activity});
            return;
        } catch (error) {
            console.error(`Unexpected error editing activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiCountActivities: RequestHandler = async (req, res, next) => {
        try {
            const activityCount: number = await ActivitiesDAO.countActivities();
            res.status(200).json({activityCount: activityCount});
        } catch (error) {
            console.error(`Unexpected error getting activity count ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }
}