/**
 * This file contains the backend routes for activities.
 * @see ActivitiesController for implemention details
 */

import express, { Router } from "express";
import ActivitiesController from "../controllers/activities.controller.js";
import passport from "passport";

const activitiesRouter: Router = express.Router();

activitiesRouter.route("/searchactivities").get(ActivitiesController.apiSearchActivities);
activitiesRouter.route("/searchactivity").get(ActivitiesController.apiSearchActivity);
activitiesRouter.route("/getparticipants").get(passport.authenticate('jwt', {session: false}), ActivitiesController.apiGetActivityParticipants);
activitiesRouter.route("/checkenrollment").get(passport.authenticate('jwt', {session: false}), ActivitiesController.apiCheckActivityEnrollment);

activitiesRouter.route("/create").post(passport.authenticate('jwt', {session: false}), ActivitiesController.apiCreateActivity);
activitiesRouter.route("/join").post(passport.authenticate('jwt', {session: false}), ActivitiesController.apiAddParticipant);

activitiesRouter.route("/unjoin").delete(passport.authenticate('jwt', {session: false}), ActivitiesController.apiRemoveParticipant);
activitiesRouter.route("/delete").delete(passport.authenticate('jwt', {session: false}), ActivitiesController.apiDeleteActivity);

export default activitiesRouter;
