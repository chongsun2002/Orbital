/// <reference path="../src/types/express/index.d.ts" />
import express, { Express, Request, Response } from "express";
import cors from "cors";
import "dotenv/config.js";
import { PrismaClient } from "@prisma/client";
import authRouter from "../src/routes/auth.routes.js";
import { passportConfig } from "../src/configs/JWTpassport.js";
import passport from "passport"
import courseRouter from "../src/routes/courses.routes.js";
import activitiesRouter from "../src/routes/activities.routes.js";
import friendsRouter from "../src/routes/friends.routes.js";
import bodyParser from "body-parser";
import path from "path";
import userRouter from "../src/routes/user.routes.js";

export const prisma: PrismaClient = new PrismaClient();
const app: Express = express();
//dotenv.config({path: "src/configs/.env"})
const port = process.env.PORT;


passportConfig(passport);
app.use(passport.initialize());

app.use(cors());
// app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/activities", activitiesRouter);
app.use("/api/v1/friends", friendsRouter);
app.use("/api/v1/user", userRouter);

app.get("/healthz", (req: Request, res: Response) => {
    res.send(`Server Ok, , test`);
})

app.use("*", (req: Request, res: Response) => 
    res.status(404).json({ error: "404 Not Found"}));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

export default app;