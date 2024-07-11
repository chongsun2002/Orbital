import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../../api/index.js";
import type { User } from "@prisma/client"
import bcrypt from "bcrypt";

interface Credentials {
    email: string;
    password: string;
};

interface SignupCredentials {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    image?: string;
}

export default class AuthDAO {
    /**
    * This function checks if the user exists in the database. If the user exists returns the user.
    * Else it throws the following exception: 
    * @throws {PrismaClientKnownRequestError}
    * @param credentials The user's credentials
    * @returns The user
    */
    static async authenticate(credentials: Credentials) : Promise<User> {
        const user: User = await prisma.user.findUniqueOrThrow({
            where: {
                email: credentials.email,
            }
        });
        if (!user.password) {
            throw new Error("User has no password. User may be linked with Google");
        }
        const match: boolean = await bcrypt.compare(credentials.password, user.password.toString());
        if (!match) {
            throw new PrismaClientKnownRequestError("Incorrect password", {
                code: "P2025",
                clientVersion: '' 
            });
        }
        return user;
    }
    
    /**
     * This function creates a user in the database.
     * @param credentials The user's credentials
     * @returns The user
     */
    static async createUser(credentials: SignupCredentials) : Promise<User> {
        const user: User = await prisma.user.create({data: {
            name: credentials.name,
            email: credentials.email,
            password: credentials.password ? Buffer.from(credentials.password) : undefined,
            googleId: credentials.googleId,
            image: credentials.image
        }});
        return user;
    }

    static async addPassword(email: string, password: string) : Promise<User> {
        const user: User = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: Buffer.from(password)
            }
        });
        return user;
    }

    static async changePassword(userId: string, newPassword: string) : Promise<void> {
        const user: User = await prisma.user.update({
            where: {
                id: userId
            }, data: {
                password: Buffer.from(newPassword)
            }
        })
    }
    
    static async getUser(id: string) : Promise<User | null> {
        const user: User | null = await prisma.user.findUnique({
            where: {
                id: id,
            }
        })
        return user;
    }

    static async getUserByEmail(email: string) : Promise<User | null> {
        const user: User | null = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })
        return user;
    } 

    static async getUserByGoogle(googleId: string) : Promise<User | null> {
        const user: User | null = await prisma.user.findUnique({
            where: {
                googleId: googleId,
            }
        })
        return user;
    }

    static async linkUserGoogle(email: string, googleId: string, image?: string) : Promise<User> {
        // If the user currently has no image, use their google image and link their google id
        const user: User | null = await prisma.user.update({
            where: {
                email: email,
                image: null
            },
            data: {
                googleId: googleId,
                image: image
            }
        });
        if (user) {
            return user;
        }

        // If the user already has an image, just link their google account
        const user2: User | null = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                googleId: googleId,
            }
        });
        return user2;
    }
}