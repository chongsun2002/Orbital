import { prisma } from '../../api/index.js'

type NUSModsLinkSharing = {
    name: string;
    url: string;
    userId?: string;
}

export default class CourseDAO {
    static async linkTimetable(userId: string, link: string) {
        const user = await prisma.user.update({
            where: {
                id: userId 
            },
            data: {
                timetableUrl: link
            }
        });
    }    

    static async getTimetable(id: string) : Promise<String | null | undefined> {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                timetableUrl: true
            }
        });
        return user?.timetableUrl;
    }

    static async createSharingLink(links: NUSModsLinkSharing) {
        const courseSharingLink = await prisma.courseSharingLink.create({
            data: {
                name: links.name,
                userId: links.userId // This will be null for non-registered users
            }
        });

        // Create the associated Link entry
        await prisma.nUSModsLink.create({
            data: {
                url: links.url,
                courseSharingLinkId: courseSharingLink.id
            }
        });

        return courseSharingLink;
    }

    static async getSharingLink(sharingLinkId: string) {
        const courseSharingLink = await prisma.courseSharingLink.findUnique({
            where: {
                id: sharingLinkId
            },
            select: {
                name: true,
                userId: true,
                links: {
                    select: {
                        url: true,
                    }
                }
            }
        });

        return courseSharingLink;
    }

    static async addSharingLink(sharingLinkId: string, link: NUSModsLinkSharing) {
        const courseSharingLink = await prisma.courseSharingLink.findUnique({
            where: {
                id: sharingLinkId
            }
        });

        if (!courseSharingLink) {
            throw new Error(`CourseSharingLink with id ${sharingLinkId} not found.`);
        }

        // Create a new Link entry associated with the CourseSharingLink
        const newLink = await prisma.nUSModsLink.create({
            data: {
                url: link.url,
                courseSharingLinkId: courseSharingLink.id
            }
        });

        return newLink;
    }

    static async editSharingLink(linkId: string, newUrl: string) {
        // Update the URL of the existing Link entry
        const updatedLink = await prisma.nUSModsLink.update({
            where: {
                id: linkId
            },
            data: {
                url: newUrl
            }
        });

        return updatedLink;
    }

    static async deleteSharingLink(linkId: string) {
        // Delete the existing Link entry
        const deletedLink = await prisma.nUSModsLink.delete({
            where: {
                id: linkId
            }
        });

        return deletedLink;
    }
}