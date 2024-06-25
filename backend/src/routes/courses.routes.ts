import express, { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import passport from "passport";

const coursesRouter: Router = express.Router();



export default coursesRouter;