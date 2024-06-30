import express, { Router } from "express";
import CoursesController from "../controllers/courses.controller.js";
import passport from "passport";

const coursesRouter: Router = express.Router();

coursesRouter.route("/linkTimetable").put(passport.authenticate('jwt', {session: false}), CoursesController.apiLinkTimetable);
coursesRouter.route("/getTimetable").get(CoursesController.apiLinkTimetable);

export default coursesRouter;