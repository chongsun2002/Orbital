import { sendFriendRequest, acceptFriendRequest, declineFriendRequest, isFriends,
    getFriends, getPendingIncoming, getPendingOutgoing, removeFriend } from "../services/friends.DAO.js";
import { User } from "@prisma/client";
import { RequestHandler } from "express";

export default class FriendsController {
    static apiSendFriendRequest: RequestHandler = async (req, res, next) => {
        const requester: User = req.user;
        const requesterId: string = requester.id;
        const recipientId : string = req.body.recipientId;
        const isSecret : boolean = req.body.isSecret;
        try {
            const friendRequest = await sendFriendRequest(requesterId, recipientId, isSecret);
            res.status(200).json({friendRequest: friendRequest});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiAcceptFriendRequest: RequestHandler = async (req, res, next) => {
        const recipient: User = req.user;
        const recipientId: string = recipient.id;
        const requesterId : string = req.body.requesterId;
        try {
            await acceptFriendRequest(requesterId, recipientId);
            res.status(200).json({message: "Successfully accepted friend request"});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiDeclineFriendRequest: RequestHandler = async (req, res, next) => {
        const recipient: User = req.user;
        const recipientId: string = recipient.id;
        const requesterId: string = req.body.requesterId;
        try {
            await declineFriendRequest(requesterId, recipientId);
            res.status(200).json({message: "Successfully declined friend request"});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiIsFriends: RequestHandler = async (req, res, next) => {
        const user: User = req.user;
        const userId: string = user.id;
        const otherUser: any = req.query.requesterId;
        const otherUserId: string = typeof otherUser === 'string' ? otherUser : '';
        try {
            const isFriend : boolean = await isFriends(userId, otherUserId);
            res.status(200).json({isFriends: isFriend});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiGetFriends: RequestHandler = async (req, res, next) => {
        const user: User = req.user;
        const id: string = user.id;
        try {
            const friends = await getFriends(id);
            res.status(200).json({friends: friends});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiGetPendingOutgoing: RequestHandler = async (req, res, next) => {
        const user: User = req.user;
        const id: string = user.id;
        try {
            const outgoing = await getPendingOutgoing(id);
            res.status(200).json({pending: outgoing});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiGetPendingIncoming: RequestHandler = async (req, res, next) => {
        const user: User = req.user;
        const id: string = user.id;
        try {
            const incoming = await getPendingIncoming(id);
            res.status(200).json({pending: incoming});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiRemoveFriend: RequestHandler = async (req, res, next) => {
        const user: User = req.user;
        const id: string = user.id;
        const friendId = req.body.friendId;
        try {
            await removeFriend(id, friendId);
            res.status(200).json({message: "Successfully removed friend"});
            return; 
        } catch (error) {
            console.error(`Unexpected error creating activity ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }
} 