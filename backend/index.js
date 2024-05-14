import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRouter from "./src/routes/auth.routes.js";
import { passportConfig } from "./src/configs/JWTpassport.js";
import passport from "passport";
export const prisma = new PrismaClient();
export const app = express();
dotenv.config({ path: "src/configs/.env" });
const port = process.env.PORT;
passportConfig(passport);
app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("*", (req, res) => res.status(404).json({ error: "404 Not Found" }));
app.get("/healthz", (req, res) => {
    res.send('Server OK');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
