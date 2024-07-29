import UserDAO from "../services/user.DAO.js"; 
import FriendsDAO from "../services/friends.DAO.js";
import { RequestHandler, Request , Response, NextFunction } from "express";

export default class UserController {
    static apiUserIsPublic: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const id: any = req.query.id;
        if (typeof id !== 'string') {
            res.status(400).json({error: "Invalid user id"});
        } 
        try {
            const isPublic = await UserDAO.userIsPublic(id);
            if (isPublic === undefined) {
                res.status(404).json({error: "User not found"});
                return;
            }
            res.status(200).json({isPublic: isPublic});
            return;
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    } 

    /**
     * This api call gets the details of the specified user if the user's profile is public, or if the user accessing and the user
     * are friends. 
     * @returns 
     */
    static apiUserGetDetails: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        } 
        const id: string = req.params.id;
        try {
            const isPublic = await UserDAO.userIsPublic(id);
            const isFriends = await FriendsDAO.isFriends(user.id, id);
            const userDetails = await UserDAO.userGetDetails(id);
            if (isPublic === undefined || userDetails === null) {
                console.error("Could not find user details");
                res.status(404).json({error: "Could not find user"});
                return;
            }
            if (isPublic || user.id === id || isFriends) {
                res.status(200).json({user: userDetails});
                return;
            } 
            res.status(200).json({user: {name: userDetails.name}});
            return;
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiUserUpdateDetails: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        } 
        try {
            const updatedUser = await UserDAO.userUpdateDetails(user.id, req.body);
            res.status(200).json(updatedUser);
            return;
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiSearchUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const rawSearch: any = req.query.search;
        const searchString: string = typeof rawSearch === 'string' ? rawSearch : "";
        try {
            const users: {
                id: string;
                name: string;
                image: string | null;
                bio: string | null;
                birthday: Date | null;
                timetableUrl: string | null;
            }[] = await UserDAO.searchUsers(searchString);
            res.status(200).json({users: users});            
            return;
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiGetNotifications: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        try {
            const notifications = await UserDAO.getNotifications(user.id);
            res.status(200).json(notifications)
            return;
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiDeleteNotification: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const notificationIds: string[] = req.body.notifications;
        const user: Express.User | undefined = req.user;
        
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
    
        if (!Array.isArray(notificationIds) || notificationIds.some(id => typeof id !== 'string')) {
            res.status(400).json({error: "Invalid request format"});
            return;
        }
        try {
            const notification = await UserDAO.deleteNotifications(notificationIds, user.id);
            res.status(200).json({deleted: true});
            return;
        } catch (error) {
            console.error(`Unexpected error deleting notification ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiViewNotification: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const rawId: any = req.params.id;
        const notificationId: string = typeof rawId === 'string' ? rawId : "";
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        try {
            await UserDAO.viewNotification(notificationId, user.id);
            res.status(200).json({viewed: true});
            return;
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiSendMessage: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const receipientId: string = req.body.receipientId;
        const content: string = req.body.content;
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        try {
            UserDAO.createNotification(receipientId, "MESSAGE", user.id, content);
            res.status(200).json({viewed: true});
            return;
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }
}