import express, { Router } from "express";
import ActivitiesController from "../controllers/activities.controller.js";
import passport from "passport";

const activitiesRouter: Router = express.Router();

activitiesRouter.route("/create").post(passport.authenticate('jwt', {session: false}), ActivitiesController.apiCreateActivity);
activitiesRouter.route("/search").post(ActivitiesController.apiSearchActivity);
activitiesRouter.route("/join").post(passport.authenticate('jwt', {session: false}), ActivitiesController.apiAddParticipant);
activitiesRouter.route("/leave").post(passport.authenticate('jwt', {session: false}), ActivitiesController.apiRemoveParticipant);
activitiesRouter.route("/delete").post(passport.authenticate('jwt', {session: false}), ActivitiesController.apiDeleteActivity);
activitiesRouter.route("/display").post(ActivitiesController.apiDisplayActivities);

export default activitiesRouter;
