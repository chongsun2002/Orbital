import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../../api/index.js";
import type { User } from "@prisma/client"

interface Credentials {
    email: string;
    password: string;
};

interface SignupCredentials extends Credentials  {
    name: string;
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
                password: credentials.password,
            }
        });
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