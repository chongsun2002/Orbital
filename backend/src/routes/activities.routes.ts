import express, { Router } from "express";
import ActivitiesController from "../controllers/activities.controller.js";

const activitiesRouter: Router = express.Router();

activitiesRouter.route("/create").post(ActivitiesController.apiCreateActivity);

export default activitiesRouter;
