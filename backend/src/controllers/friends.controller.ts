import FriendsDAO from "../services/friends.DAO.js";
import { User, FriendRequest } from "@prisma/client";
import { RequestHandler } from "express";

export default class FriendsController {
    static apiSendFriendRequest: RequestHandler = async (req, res, next) => {
        const requester: User = req.user;
        const recipientId = req.body.recipientId;
        const isSecret = req.body.isSecret;
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
        const recipient: User = req.user;
        const requesterId = req.body.requesterId;
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
        const recipient: User = req.user;
        const requesterId = req.body.requesterId;
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
        const user: User = req.user;
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
        const user: User = req.user;
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
        const user: User = req.user;
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
        const user: User = req.user;
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
        const user: User = req.user;
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