import express, { Router } from "express";
import AuthController from "../controllers/auth.controller.js";

const authRouter: Router = express.Router();

authRouter.route("/login").post(AuthController.apiLogin);
authRouter.route("/signup").post(AuthController.apiCreateUser);

export default authRouter;