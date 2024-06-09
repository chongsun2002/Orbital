/**
 * This file contains prisma queries for getting information of users.
 */

import { prisma } from "../../api/index.js";

interface UpdateUserDetails {
    name: string,
    bio?: string,
    birthday?: Date
}

export default class UserDAO {
    /**
     * This function checks if the user has set their profile to public or not.
     * @param id The user's id
     * @returns A boolean representing whether the user's profile is public 
     */
    static async userIsPublic(id: string): Promise<Boolean | undefined>{
        const user: { isPublic: boolean } | null = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                isPublic: true
            }
        });
        return user?.isPublic;
    }

    /**
     * This function returns the user's details which to be displayed on their profile page.
     * @param id The user's id 
     * @returns The user's name, image, bio and birthday 
     */
    static async userGetDetails(id: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                name: true,
                image: true,
                bio: true,
                birthday: true
            }
        });
        return user;
    }

    /**
     * This function updates a user's details. 
     * @param id The user's id
     * @param data The user's updated details
     * @returns The updated user
     */
    static async userUpdateDetails(id: string, data: UpdateUserDetails) {
        const user = await prisma.user.update({
            where: {
                id: id
            },
            data: data
        });
        return user;
    }
}