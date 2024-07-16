import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import AuthDAO from "../services/authDAO.js";
import { User } from "@prisma/client";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { createJWT } from "../configs/JWTpassport.js";
import bcrypt from "bcryptjs";
import { sendPasswordResetEmail } from "../configs/sendEmail.js";

/**
 * To improve on: ensure that emails are nus emails only.
 * Notes: ALL error typecasts are safe because you only catch errors
 */

export interface filteredUser {
    name: string,
    image: string | null
}

export default class AuthController {
    // static #sanitizeUser(user: User) : User {
    //     // Fields that should not be exposed when request is sent back;
    //     delete user.password;
    //     delete user.id;
    //     delete user.email;
    //     delete user.emailVerified;
    //     delete user.createdAt;
    //     delete user.updatedAt;
    //     return user;
    // }
    static sanitizeUser(user: User) : filteredUser {
        const filtered: filteredUser = { name: user.name, image: user.image };
        return filtered;
    }

    /**
     * This function allows a user to login.
     * Expected fields in the req body:
     * @param email The user's email address
     * @param password The user's password
     * @returns The user and their JWT in the response body
     */
    static apiLogin: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        try {
            const user: User = await AuthDAO.authenticate({email: email, password: password});
            const token = createJWT(user);
            
            res.status(200).json({user: this.sanitizeUser(user), token: token});
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

    /**
     * This function creates a new user. 
     * Expected fields in the request body:
     * @param name User's name
     * @param email User's email
     * @param password User's password 
     * @returns The newly created user 
     */
    static apiCreateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const name: string = req.body.name;
        const email: string = req.body.email;
        const password: string = req.body.password;
        const saltRounds = 10;
        /* 
        const confirmedPassword: string = req.body.confirmedPassword; // Can potentially be removed
        if (confirmedPassword !== password) {
            console.error('User submitted a password different from the confirmed password');
            res.status(400).json({error: "Bad Request"});
        }
        */
        try {
            const user: User = await AuthDAO.createUser({name: name, email: email});
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.error(`Unexpected error hashing password ${err}`);
                    res.status(500).json({error: err.message});
                    return;
                }
                AuthDAO.addPassword(email, hash);
            });
            const token = createJWT(user);
            res.status(200).json({user: this.sanitizeUser(user), token: token});
            return;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if ((error as PrismaClientKnownRequestError).code === "P2002") {
                    console.error(`User supplied duplicate credentials ${email}, ${name}`);
                    res.status(400).json({error: (error as Error).message});
                    return;
                } else {
                    console.error(`Unexpected Prisma Error creating User ${error}`);
                    res.status(500).json({error: (error as Error).message});
                    return;
                }
            } else {
                console.error(`Unexpected Error creating User ${error}`);
                res.status(500).json({error: (error as Error).message});
                return;
            }
        }
    }

    static apiHandleGoogle: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const name: string = req.body.name;
        const email: string = req.body.email;
        const googleId: string = req.body.googleId;
        const image: string | undefined = req.body.image;
        var user: User | null;
        try {
            user = await AuthDAO.getUserByGoogle(googleId); 
            if(user) {
                const token = createJWT(user);
                res.status(200).json({user: this.sanitizeUser(user), token: token});
                return;
            }
            user = await AuthDAO.getUserByEmail(email);
            if(user) {
                user = await AuthDAO.linkUserGoogle(email, googleId, image);
                const token = createJWT(user);
                res.status(200).json({user: this.sanitizeUser(user), token: token});
                return;
            }
            user = await AuthDAO.createUser({ name: name, email: email, googleId: googleId, image: image});
            const token = createJWT(user);
            res.status(200).json({user: this.sanitizeUser(user), token: token});
            return;
        } catch (error) {
            console.error(`Unexpected error signing in with Google ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiResetPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const user: Express.User | undefined = req.user;
        if (!user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        const password: string = req.body.password;
        const saltRounds = 10;
        try {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.error(`Unexpected error hashing password ${err}`);
                    res.status(500).json({error: err.message});
                    return;
                }
                AuthDAO.changePassword(user.id, hash);
            });
            res.status(200).json({message: "Password changed successfully"});
            return;
        } catch (error) {
            console.error(`Unexpected Error changing password ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }

    static apiForgetPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const email: string = req.body.email;
        try {
            const user: User | null = await AuthDAO.getUserByEmail(email);
            if (!user) {
                res.status(404).json({error: "Could not find user with the given email!"});
                return;
            }
            sendPasswordResetEmail(email, user);
            res.status(200).json({ message: "Link Sent Successfully"});
            return;
        } catch (error) {
            console.error(`Unexpected error sending password reset link ${error}`);
            res.status(500).json({error: (error as Error).message});
            return;
        }
    }
}