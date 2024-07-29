import FriendsDAO from "../services/friends.DAO.js";
import { RequestHandler, Request, Response, NextFunction } from "express";
import UserDAO from "../services/user.DAO.js";

export default class FriendsController {
    /**
     * This function sends a friend request from the logged-in user to another user. 
     * Expected fields in the request body:
     * @param recipientId The id of the recipient of the friend request
     * @param isSecret Boolean representing whether the friend request is anonymous
     * @returns The new friend request in the body of the response 
     */
    static apiSendFriendRequest: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const requester: Express.User | undefined = req.user;
        if (!requester) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const recipientId : string = req.body.recipientId;
        const isSecret : boolean = req.body.isSecret;
        try {
            if (!isSecret) {
                const notificationType = "FRIENDREQUEST";
                await UserDAO.createNotification(recipientId, notificationType, requester.id);
            }
            const friendRequest = await FriendsDAO.sendFriendRequest(requester.id, recipientId, isSecret);
            res.status(200).json({friendRequest: friendRequest});
            return; 
        } catch (error) {
            console.error(`Unexpected error sending friend request ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiUnsendFriendRequest: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const requestor: Express.User | undefined = req.user;
        if (!requestor) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const recipientId : string = req.body.recipientId;
        try {
            const unsend = await FriendsDAO.unsendFriendRequest(requestor.id, recipientId);
            res.status(200).json({removedFriendRequest: unsend});
        } catch (error) {
            console.error(`Unexpected error deleting friend request ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiCheckHasRequested: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const requestor: Express.User | undefined = req.user;
        const rawId: any = req.params.id;
        const recipientId: string = typeof rawId === 'string' ? rawId : "";
        if (!requestor) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        try {
            const hasRequested = await FriendsDAO.checkHasRequested(requestor.id, recipientId);
            res.status(200).json({hasRequested: hasRequested});
        } catch (error) {
            console.error(`Unexpected error checking friend request ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This function allows a user to accept a pending friend request. 
     * Expected fields in the request body:
     * @param requesterId The id of the requester of the friend request
     */
    static apiAcceptFriendRequest: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const recipient: Express.User | undefined = req.user;
        if (!recipient) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const requesterId : string = req.body.requesterId;
        try {
            await FriendsDAO.acceptFriendRequest(requesterId, recipient.id);
            res.status(200).json({message: "Successfully accepted friend request"});
            return; 
        } catch (error) {
            console.error(`Unexpected error accepting friend request ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This function allows a user to decline a pending friend request. 
     * Expected fields in the request body:
     * @param requesterId The id of the requester of the friend request
     */
    static apiDeclineFriendRequest: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const recipient: Express.User | undefined = req.user;
        if (!recipient) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const requesterId: string = req.body.requesterId;
        try {
            await FriendsDAO.declineFriendRequest(requesterId, recipient.id);
            res.status(200).json({message: "Successfully declined friend request"});
            return; 
        } catch (error) {
            console.error(`Unexpected error declining friend request ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This function checks if two users are currently friends. 
     * Expected fields in the request query:
     * @param userId The id of the other user
     * @returns A boolean representing whether the two users are friends in the body of the response  
     */
    static apiIsFriends: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const otherUser: any = req.query.userId;
        const otherUserId: string = typeof otherUser === 'string' ? otherUser : '';
        try {
            const isFriends: boolean = await FriendsDAO.isFriends(user.id, otherUserId);
            res.status(200).json({isFriends: isFriends});
            return; 
        } catch (error) {
            console.error(`Unexpected error checking friends ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This function gets all the friends of the logged-in user. 
     * @returns A list of the user's friends, containing their id, name and image
     */
    static apiGetFriends: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        try {
            const friends = await FriendsDAO.getFriends(user.id);
            res.status(200).json({friends: friends});
            return; 
        } catch (error) {
            console.error(`Unexpected error getting friends ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This function gets all the pending outgoing friend requests from the logged-in user. 
     * @returns A list of the relevant users, containing their id, name and image
     */
    static apiGetPendingOutgoing: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const id: string = user.id;
        try {
            const outgoing = await FriendsDAO.getPendingOutgoing(user.id);
            res.status(200).json({pending: outgoing});
            return; 
        } catch (error) {
            console.error(`Unexpected error getting friend requests ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This function gets all the pending incoming friend requests from the logged-in user, where the friend request is not secret.
     * @returns A list of the relevant users, containing their id, name and image
     */
    static apiGetPendingIncoming: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const id: string = user.id;
        try {
            const incoming = await FriendsDAO.getPendingIncoming(user.id);
            res.status(200).json({pending: incoming});
            return; 
        } catch (error) {
            console.error(`Unexpected error getting friend requests ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    /**
     * This functions removes two users as friends. 
     * Expected fields in the req body: 
     * @friendId The id of the friend to be removed
     */
    static apiRemoveFriend: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const friendId = req.body.friendId;
        try {
            await FriendsDAO.removeFriend(user.id, friendId);
            res.status(200).json({message: "Successfully removed friend"});
            return; 
        } catch (error) {
            console.error(`Unexpected error removing friend ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }
} 