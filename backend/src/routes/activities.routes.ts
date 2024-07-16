import express, { Router } from "express";
import ActivitiesController from "../controllers/activities.controller.js";
import passport from "passport";

const activitiesRouter: Router = express.Router();

activitiesRouter.route("/searchactivities").get(ActivitiesController.apiSearchActivities);
activitiesRouter.route("/searchactivity/:id").get(ActivitiesController.apiSearchActivity);
activitiesRouter.route("/getparticipants/:id").get(passport.authenticate('jwt', {session: false}), ActivitiesController.apiGetActivityParticipants);
activitiesRouter.route("/checkenrollment/:id").get(passport.authenticate('jwt', {session: false}), ActivitiesController.apiCheckActivityEnrollment);
activitiesRouter.route("/checkisorganiser/:id").get(passport.authenticate('jwt', {session: false}), ActivitiesController.apiCheckIsOrganiser);
activitiesRouter.route("/getorganised").get(ActivitiesController.apiGetOrganisedActivities);
activitiesRouter.route("/getjoined").get(ActivitiesController.apiGetJoinedActivities);
activitiesRouter.route("/countactivities").get(ActivitiesController.apiCountActivities);

activitiesRouter.route("/create").post(passport.authenticate('jwt', {session: false}), ActivitiesController.apiCreateActivity);
activitiesRouter.route("/join/:id").post(passport.authenticate('jwt', {session: false}), ActivitiesController.apiAddParticipant);

activitiesRouter.route("/edit/:id").patch(passport.authenticate('jwt', {session: false}), ActivitiesController.apiEditActivity);

activitiesRouter.route("/unjoin/:id").delete(passport.authenticate('jwt', {session: false}), ActivitiesController.apiRemoveParticipant);
activitiesRouter.route("/delete/:id").delete(passport.authenticate('jwt', {session: false}), ActivitiesController.apiDeleteActivity);

export default activitiesRouter;
