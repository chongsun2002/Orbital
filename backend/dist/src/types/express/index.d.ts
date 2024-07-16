import { User as PrismaUser } from "@prisma/client";

declare global {
    declare namespace Express {
      export interface User extends PrismaUser {
        
      }
    }
  }

export{}