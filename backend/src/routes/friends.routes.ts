/**
 * This file contains the backend routes for actions related to friends and friendships.
 * @see FriendsController for implementation details
 */

import express, { Router } from "express";
import FriendsController from "../controllers/friends.controller.js";
import passport from "passport";

const friendsRouter: Router = express.Router();

friendsRouter.route("/send").post(passport.authenticate('jwt', {session: false}), FriendsController.apiSendFriendRequest);
friendsRouter.route("/accept").post(passport.authenticate('jwt', {session: false}), FriendsController.apiAcceptFriendRequest);
friendsRouter.route("/decline").post(passport.authenticate('jwt', {session: false}), FriendsController.apiDeclineFriendRequest);
friendsRouter.route("/check").get(passport.authenticate('jwt', {session: false}), FriendsController.apiIsFriends);
friendsRouter.route("/all").get(passport.authenticate('jwt', {session: false}), FriendsController.apiGetFriends);
friendsRouter.route("/outgoing").get(passport.authenticate('jwt', {session: false}), FriendsController.apiGetPendingOutgoing);
friendsRouter.route("/incoming").get(passport.authenticate('jwt', {session: false}), FriendsController.apiGetPendingIncoming);
friendsRouter.route("/remove").delete(passport.authenticate('jwt', {session: false}), FriendsController.apiRemoveFriend);

export default friendsRouter;
