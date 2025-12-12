import { prisma } from "./src/lib/db";

async function main() {
    try {
        const count = await prisma.user.count();
        console.log(`Successfully connected. User count: ${count}`);
    } catch (e) {
        console.error("Error connecting to DB:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
