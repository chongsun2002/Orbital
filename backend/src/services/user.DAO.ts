/**
 * This file contains prisma queries for getting information of users.
 */

import { Notification, NotificationCategory } from "@prisma/client";
import { prisma } from "../../api/index.js";

interface UpdateUserDetails {
    name: string,
    bio?: string,
    birthday?: Date,
    timetableUrl?: string
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
                birthday: true,
                timetableUrl: true,
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

    /**
     * This function updates a user's details. 
     * @param id The user's id
     * @param data The user's updated details
     * @returns The updated user
     */
    static async searchUsers(name: string) {
        const searchQuery = name.split(' ').join(' & ')
        const user = await prisma.user.findMany({
            take: 10,
            orderBy: {
                _relevance: {
                    fields: ['name', 'email'],
                    search: searchQuery,
                    sort: 'desc'
                }
            },
            select: {
                id: true,
                name: true,
                image: true,
                bio: true,
                birthday: true,
                timetableUrl: true,
            }
        })
        return user;
    }

    static async createNotification(userId: string, notificationType: string, additionalId?: string, content?: string) { 
        const notification = await prisma.notification.create({
            data: {
                userId: userId,
                notificationType: notificationType as NotificationCategory,
                additionalContentId: additionalId,
                content: content,
            }
        })
        return notification
    }

    static async getNotifications(userId: string): Promise<Notification[]> {
        const notifications = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                notifications: true,
            }
        })
        return notifications?.notifications || [];
    }

    static async deleteNotifications(notificationIds: string[], userId: string) {
        const del = await prisma.notification.deleteMany({
            where: {
                id: {
                    in: notificationIds
                },
                userId: userId
            }
        });
        return del;
    }

    static async viewNotification(notificationId: string, userId: string) {
        const update = await prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId: userId,
            },
            data: {
                seen: true,
            }
        })
        return update;
    }
}