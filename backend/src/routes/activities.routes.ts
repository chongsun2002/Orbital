import express, { Router } from "express";
import ActivitiesController from "../controllers/activities.controller.js";
import passport from "passport";

const activitiesRouter: Router = express.Router();

activitiesRouter.route("/create").post(passport.authenticate('jwt', {session: false}), ActivitiesController.apiCreateActivity);

export default activitiesRouter;
