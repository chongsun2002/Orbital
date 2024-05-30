import FriendsDAO from "../services/friends.DAO.js";
import { User } from "@prisma/client";
import { RequestHandler, Request, Response, NextFunction } from "express";

export default class FriendsController {
    static apiSendFriendRequest: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        
        const requester: Express.User | undefined = req.user;
        if (!requester) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const requesterId: string = requester.id;
        const recipientId : string = req.body.recipientId;
        const isSecret : boolean = req.body.isSecret;
        try {
            const friendRequest = await FriendsDAO.sendFriendRequest(requester.id, recipientId, isSecret);
            res.status(200).json({friendRequest: friendRequest});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiAcceptFriendRequest: RequestHandler = async (req, res, next) => {
        const recipient: Express.User | undefined = req.user;
        if (!recipient) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const recipientId: string = recipient.id;
        const requesterId : string = req.body.requesterId;
        try {
            await FriendsDAO.acceptFriendRequest(requesterId, recipient.id);
            res.status(200).json({message: "Successfully accepted friend request"});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiDeclineFriendRequest: RequestHandler = async (req, res, next) => {
        const recipient: Express.User | undefined = req.user;
        if (!recipient) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const recipientId: string = recipient.id;
        const requesterId: string = req.body.requesterId;
        try {
            await FriendsDAO.declineFriendRequest(requesterId, recipient.id);
            res.status(200).json({message: "Successfully declined friend request"});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiIsFriends: RequestHandler = async (req, res, next) => {
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const userId: string = user.id;
        const otherUser: any = req.query.requesterId;
        const otherUserId: string = typeof otherUser === 'string' ? otherUser : '';
        try {
            const isFriends: boolean = await FriendsDAO.isFriends(user.id, otherUserId);
            res.status(200).json({isFriends: isFriends});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiGetFriends: RequestHandler = async (req, res, next) => {
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const id: string = user.id;
        try {
            const friends = await FriendsDAO.getFriends(user.id);
            res.status(200).json({friends: friends});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiGetPendingOutgoing: RequestHandler = async (req, res, next) => {
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
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiGetPendingIncoming: RequestHandler = async (req, res, next) => {
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
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiRemoveFriend: RequestHandler = async (req, res, next) => {
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const id: string = user.id;
        const friendId = req.body.friendId;
        try {
            await FriendsDAO.removeFriend(user.id, friendId);
            res.status(200).json({message: "Successfully removed friend"});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }
} 