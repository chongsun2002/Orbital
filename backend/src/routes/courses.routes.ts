import express, { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import passport from "passport";

const courseRouter: Router = express.Router();

courseRouter.get("/protected", passport.authenticate('jwt', {session: false}), (req, res, next) => {
    console.log(req.user)
    res.status(200).json({msg: "Authorized!"});
})

export default courseRouter;