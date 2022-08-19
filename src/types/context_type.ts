import { PrismaClient, User } from "@prisma/client";

export interface Context {
    prisma:         PrismaClient,
    logged_in_user: User
}