import { prisma } from "../../index.js";
export default class AuthDAO {
    /**
    * This function checks if the user exists in the database. If the user exists returns the user.
    * Else it throws the following exception:
    * @throws {PrismaClientKnownRequestError}
    */
    static async authenticate(credentials) {
        const user = await prisma.user.findUniqueOrThrow({
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
    static async createUser(credentials) {
        console.log(credentials.name);
        console.log(credentials.password);
        console.log(credentials.email);
        const user = await prisma.user.create({ data: {
                name: credentials.name,
                email: credentials.email,
                password: credentials.password,
            } });
        return user;
    }
    static async getUser(id) {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            }
        });
        return user;
    }
}
;
