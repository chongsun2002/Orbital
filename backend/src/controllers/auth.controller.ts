import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import AuthDAO from "../services/authDAO.js";
import { User } from "@prisma/client";
import { RequestHandler } from "express";
import { createJWT } from "../configs/JWTpassport.js";

/**
 * To improve on: ensure that emails are nus emails only.
 * Notes: ALL error typecasts are safe because you only catch errors
 */

export default class AuthController {
    static apiLogin: RequestHandler = async (req, res, next) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        try {
            const user: User = await AuthDAO.authenticate({email: email, password: password});
            const token = createJWT(user);
            res.status(200).json({user: user, token: token});
            return;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if ((error as PrismaClientKnownRequestError).code === "P2025") {
                    console.error(`User supplied wrong credentials ${email}, ${password}`);
                    res.status(401).json({error: (error as Error).message});
                    return;
                } else {
                    console.error(`Unexpected Prisma Error authenticating User ${error}`);
                    res.status(500).json({error: (error as Error).message});
                    return;
                }
            } else {
                console.error(`Unexpected Error authenticating User ${error}`);
                res.status(500).json({error: (error as Error).message});
                return;
            }
        }
    }

    static apiCreateUser: RequestHandler = async (req, res, next) => {
        const name: string = req.body.name;
        const email: string = req.body.email;
        const password: string = req.body.password;
        const confirmedPassword: string = req.body.confirmedPassword; // Can potentially be removed
        if (confirmedPassword !== password) {
            console.error('User submitted a password different from the confirmed password');
            res.status(400).json({error: "Bad Request"});
        }
        try {
            const user: User = await AuthDAO.createUser({name: name, email: email, password: password});
            const token = createJWT(user);
            res.status(200).json({user: user, token: token});
            return;
        } catch (error) {
            console.error(`Unexpected Error creating User ${error}`);
            res.status(500).json({error: (error as Error).message});
        }
    }
}