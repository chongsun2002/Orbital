import express from "express";
import AuthController from "../controllers/auth.controller.js";
const authRouter = express.Router();
authRouter.route("/login").post(AuthController.apiLogin);
authRouter.route("/signup").post(AuthController.apiCreateUser);
export default authRouter;
