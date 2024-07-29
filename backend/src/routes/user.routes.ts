/**
 * This file contains the backend routes for actions related to users.
 * @see UserController for implementation details
 */

import express, { Router } from "express";
import UserController from "../controllers/user.controller.js";
import passport from "passport";

const userRouter: Router = express.Router();

userRouter.route('/public').get(UserController.apiUserIsPublic);
userRouter.route('/details/:id').get(passport.authenticate('jwt', {session: false}), UserController.apiUserGetDetails);
userRouter.route('/search').get(UserController.apiSearchUsers);
userRouter.route('/update').put(passport.authenticate('jwt', {session: false}), UserController.apiUserUpdateDetails);

userRouter.route('/getnotifications').get(passport.authenticate('jwt', {session: false}), UserController.apiGetNotifications);
userRouter.route('/deletenotifications').delete(passport.authenticate('jwt', {session: false}), UserController.apiDeleteNotification);
userRouter.route('/viewnotification/:id').post(passport.authenticate('jwt', {session: false}), UserController.apiViewNotification);
userRouter.route('/sendmessage').post(passport.authenticate('jwt', {session: false}), UserController.apiSendMessage);

export default userRouter;