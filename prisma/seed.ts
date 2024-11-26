import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";
async function main() {
    const prisma = new PrismaClient();
    await prisma.user.create({
        data: {
            email: "admin@admin.com",
            password: await hash("admin"),
        }
    });
}
main()