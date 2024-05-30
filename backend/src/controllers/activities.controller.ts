import ActivitiesDAO from "../services/activities.DAO";
import { User, Activity } from "@prisma/client";
import { RequestHandler, Request , Response, NextFunction } from "express";

export default class ActivitiesController {

    /**
     * This function allows the user to create an activity with the specified details.
     * Expected fields in the req body:
     * @param title Title of the activity
     * @param description Description of the activity, optional
     * @param startTime Start Date of the activity
     * @param endTime End Date of the activity
     * @param numOfParticipants Maximum number of participants for the activity
     * @param category Category of the activity
     * @param location Location where the activity will be held 
     * @returns The created activity in the body of the response
     */
    static apiCreateActivity : RequestHandler = async (req, res, next) => {
        const title: string = req.body.title
        const description: string | undefined = typeof req.body.description === 'string' ? req.body.description : undefined;
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
     * This function allows the user to search for activities with a specified search string
     * Expected fields in teh request query:
     * @param rawSearch The search string that the users input
     * @param rawPageNum The page number the user is on
     * @param rawCategory The category the user is filtering for
     * @param rawDate User wants to see activities happening on this date
     * @param rawLocation User wants to see activities at this location
     * @returns The activities which match the search filters are returned in the body of the response
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

    /**
     * This function lets us find an activity from its unique id.
     * Expected fields in the request query:
     * @param rawId: The id of the activity we are searching for. 
     * @returns The activity's details in the body of the response.
     */
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

    /**
     * This function allows us to add a user to an existing activity as a participant, if the activity hsa not yet
     * reached maximum capacity.
     * Expected fields in the request body:
     * @param activityId The id of the activity
     * @returns The activity in the response body, if the operation was successful. 
     */
    static apiAddParticipant: RequestHandler = async (req, res, next) => {
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
            console.error(`Unexpected error creating activity ${error}`)
            res.status(500).json({error: (error as Error).message})
            return;
        }
    }

    /**
     * This function allows us to remove a currently enrolled user from an existing activity.
     * Expected fields in the request body:
     * @param activityId The id of the activity
     * @returns The activity in the response body, if the operation was successful. 
     */
    static apiRemoveParticipant: RequestHandler = async (req, res, next) => {
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
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This operation checks if the currently logged-in user is a participant of an activity.
     * Expected fields in the request query:
     * @param rawId The id of the activity we are querying 
     * @returns A boolean representing whether or not the user is enrolled, in the body of the response
     */
    static apiCheckActivityEnrollment: RequestHandler = async (req, res, next) => {
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
     * This function allows us to check all the participants in an activity. 
     * Expected params in the request query:
     * @param rawId The id of the activity
     * @returns The names of the participants in the body of the response
     */
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
    static apiDeleteActivity: RequestHandler = async (req, res, next) => {
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

    static apiEditActivity: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const rawId: any = req.params.id;
        const activityId: string = typeof rawId === 'string' ? rawId : "";
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
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