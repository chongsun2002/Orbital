import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRouter from "./src/routes/auth.routes.js";
import { passportConfig } from "./src/configs/JWTpassport.js";
import passport from "passport"
import courseRouter from "./src/routes/courses.routes.js";
import activitiesRouter from "./src/routes/activities.routes.js";

export const prisma: PrismaClient = new PrismaClient();
export const app: Express = express();
dotenv.config({path: "src/configs/.env"})
const port = process.env.PORT;


passportConfig(passport);
app.use(passport.initialize());

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/activities", activitiesRouter);
app.use("*", (req: Request, res: Response) => 
    res.status(404).json({ error: "404 Not Found"}));

app.get("/healthz", (req: Request, res: Response) => {
    res.send('Server OK');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
