import ActivitiesDAO from "../services/activities.DAO.js";
import { Activity } from "@prisma/client";
import { RequestHandler, Request , Response, NextFunction } from "express";

export default class ActivitiesController {
    /**
     * This function creates an activity with the specified details.
     * Expected fields in the request body:
     * @param title Title of the activity
     * @param description Description of the activity, optional
     * @param startTime Start date (including time) of the activity
     * @param endTime End date (including time) of the activity
     * @param numOfParticipants Maximum number of participants
     * @param category Category the activity falls under
     * @param location Location where the activity will be held
     * @returns The created activity in the body of the response
     */
    static apiCreateActivity : RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const title: string = req.body.title
        const description: string = req.body.description
        const startTime: Date = req.body.startTime
        const endTime: Date = req.body.endTime
        const numOfParticipants: number = req.body.numOfParticipants
        const category: string = req.body.category
        const location: string = req.body.location
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
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
            const activityId: string = activity.id;
            res.status(200).json({activityId: activityId});
            return
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`)
            res.status(500).json({error: (error as Error).message})
            return
        } 
    }

    /**
     * This function searches for activities with the specified search parameters.
     * Expected fields in the request query:
     * @param rawSearch The search string inputted by the user
     * @param rawPageNum The page the user is viewing
     * @param rawCategory The category filtered by the user
     * @param rawDate The date filtered by the user
     * @param rawLocation The location filtered by the user
     * @returns The activities which match the search string in the body of the response
     */
    static apiSearchActivities: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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
            console.error(`Unexpected error searching for activities ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This function returns the activity given by its unique id. 
     * Expected fields in the request query:
     * @param rawId The activity's id
     * @returns The given activity in the body of the response
     */
    static apiSearchActivity: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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
            console.error(`Unexpected error finding activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This function adds the logged-in user as a participant to an activity, if the activity is not yet full.
     * @returns The joined activity in the body of the response
     */
    static apiAddParticipant: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        if (!(await ActivitiesDAO.countParticipants(activityId))) {
            console.error("Activity is full!");
            res.status(406).json({error: "Activity is full!"});
            return;
        }
        try {
            const activity: Activity | void = await ActivitiesDAO.addParticipant(activityId, user.id);
            res.status(200).json({activity: activity});            
            return;
        } catch (error) {
            console.error(`Unexpected error joining activity ${error}`)
            res.status(500).json({error: (error as Error).message})
            return;
        }
    }

    /**
     * This function removes the logged-in user from an activity they are currently enrolled in.
     * @returns The relevant activity in the body of the response
     */
    static apiRemoveParticipant: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        try {
            const activity: Activity = await ActivitiesDAO.removeParticipant(activityId, user.id);
            res.status(200).json({activities: activity});            
            return;
        } catch (error) {
            console.error(`Unexpected error leaving activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This function checks if the logged-in user is currently enrolled in an activity. 
     * @returns A boolean representing if the user is enrolled in the activity, in the body of the response
     */
    static apiCheckActivityEnrollment: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        try {
            const isEnrolled: boolean = await ActivitiesDAO.checkActivityEnrollment(activityId, user.id);
            res.status(200).json({enrolled: isEnrolled});
            return;
        } catch (error) {
            console.error(`Unexpected error checking activity enrollment ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This function gets the participants of an activity. 
     * Expected fields in the request query:
     * @param activityId The id of the activity
     * @returns The names of the participants in the activity in the body of the response 
     */
    static apiGetActivityParticipants: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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

    static apiGetOrganisedActivities: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const rawId: any = req.query.id;
        if (typeof rawId !== 'string') {
            res.status(400).json({error: "User ID invalid"});
            return;
        }
        try {
            const activities: Activity[] | undefined = await ActivitiesDAO.getOrganisedActivities(rawId);
            if (activities === undefined) {
                res.status(404).json({error: "User not found"});
                return;
            }
            res.status(200).json({organisedActivities: activities});
            return;
        } catch (error) {
            console.error(`Unexpected error getting activities ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        } 
    }

    static apiGetJoinedActivities: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const rawId: any = req.query.id;
        if (typeof rawId !== 'string') {
            res.status(400).json({error: "User ID invalid"});
            return;
        }
        try {
            const activities: Activity[] | undefined = await ActivitiesDAO.getJoinedActivities(rawId);
            if (activities === undefined) {
                res.status(404).json({error: "User not found"});
                return;
            }
            res.status(200).json({joinedActivities: activities});
            return;
        } catch (error) {
            console.error(`Unexpected error getting activities ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        } 
    }

    /**
     * This function checks if the logged-in user is the creator of the relevant activity.
     * @returns A boolean representing if the user is the creator of the activity, in the body of the response
     */
    static apiCheckIsOrganiser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        try {
            const isOwner: boolean = await ActivitiesDAO.checkIfOwner(activityId, user.id);
            res.status(200).json({isOwner: isOwner});
            return;
        } catch (error) {
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This function allows a user to delete an activity if they are the original creator of the activity. 
     * Expected fields in the request body:
     * @param activityId The id of the activity
     * @returns The deleted activity in the body of the response
     */
    static apiDeleteActivity: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
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

    /**
     * This function allows the owner of an existing activity to edit its details.
     * @param req Holds the new details of the activity in its body
     * @returns The edited activity in the body of the response
     */
    static apiEditActivity: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        if (!(await ActivitiesDAO.checkIfOwner(activityId, user.id))) {
            console.error("User is not the creator of this activity");
            res.status(403).json({error: "User is not the creator of this activity"});
            return;
        }
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

    /**
     * This function returns the total number of activities in the database. 
     * @returns The number of activities in the body of the response
     */
    static apiCountActivities: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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