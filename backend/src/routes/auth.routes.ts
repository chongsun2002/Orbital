/**
 * This file contains the routes for authentication related actions.
 * @see AuthController for implementation details
 */

import express, { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import passport from "passport";

const authRouter: Router = express.Router();

authRouter.route("/login").post(AuthController.apiLogin);
authRouter.route("/signup").post(AuthController.apiCreateUser);
authRouter.route("/google").post(AuthController.apiHandleGoogle);
authRouter.route("/forgetpassword").post(AuthController.apiForgetPassword);
authRouter.route("/resetpassword").post(passport.authenticate('jwt', {session: false}), AuthController.apiResetPassword);

export default authRouter;