import express, { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import passport from "passport";

const authRouter: Router = express.Router();

authRouter.route("/login").post(AuthController.apiLogin);
authRouter.route("/signup").post(AuthController.apiCreateUser);
authRouter.route("/getId").get(passport.authenticate('jwt', {session: false}), AuthController.apiGetUserId);

export default authRouter;