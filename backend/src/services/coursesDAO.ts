import { prisma } from '../../api/index.js'

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
}