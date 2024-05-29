import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../../index.js";
import type { User } from "@prisma/client"

interface Credentials {
    name?: string;
    email: string;
    password: string;
};

/**
* This function checks if the user exists in the database. If the user exists returns the user.
* Else it throws the following exception: 
* @throws {PrismaClientKnownRequestError}
*/
async function authenticate(credentials: Credentials) : Promise<User> {
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
async function createUser(credentials: Credentials) : Promise<User> {
    const user: User = await prisma.user.create({data: {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
    }});
    return user;
}

async function getUser(id: string) : Promise<User | null> {
    const user: User | null = await prisma.user.findUnique({
        where: {
            id: id,
        }
    })
    return user;
}

export { authenticate, createUser, getUser };