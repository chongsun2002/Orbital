import { NextFunction, Request, Response, RequestHandler } from "express";
import CourseDAO from "../services/coursesDAO.js";
import UserDAO from "../services/user.DAO.js";

export default class CoursesController {
    static apiLinkTimetable: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const timetableUrl: string = req.body.timetableUrl;
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        try {
            const check = UserDAO.userGetDetails(user.id);
            if (!check) {
                res.status(404).json({error: "User not found"});
                return;
            }
            await CourseDAO.linkTimetable(user.id, timetableUrl);
            res.status(200);
            return;
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiGetTimetable: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const id: any = req.query.id;
        if (typeof id !== "string") {
            res.status(400).json({error: "Invalid user id"});
            return;
        }
        try {
            const user = await CourseDAO.getTimetable(id);
            if(user == undefined) {
                res.status(404).json({error: "User not found"});
                return;
            }
            res.status(200).json({link: user ?? ""});
            return;
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiCreateSharingLink: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const links = req.body.links
        try {
            const sharingLink = CourseDAO.createSharingLink(links);
            res.status(200).json({link: (await sharingLink).id});
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }
}