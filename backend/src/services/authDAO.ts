import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../../index.js";
import type { User } from "@prisma/client"

type Credentials = {
    name?: string;
    email: string;
    password: string;
};

export default class AuthDAO {
    /**
    * This function checks if the user exists in the database. If the user exists returns the user.
    * Else it throws the following exception: 
    * @throws {PrismaClientKnownRequestError}
    */
    static async authenticate(credentials: Credentials) : Promise<User> {
        const user: User = await prisma.user.findUniqueOrThrow({
            where: {
                email: credentials.email,
                password: credentials.password,
            }
        });
        return user;
    }
    
    /**
     * This function creates a user in the database
     */
    static async createUser(credentials: Credentials) : Promise<User> {
        console.log(credentials.name);
        console.log(credentials.password);
        console.log(credentials.email);
        const user: User = await prisma.user.create({data: {
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
        }});
        return user;
    }
    
    static async getUser(id: string) : Promise<User | null> {
        const user: User | null = await prisma.user.findUnique({
            where: {
                id: id,
            }
        })
        return user;
    }

};