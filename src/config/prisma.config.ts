import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString: string = `${process.env.DATABASE_URL}`;
const adapter: PrismaPg = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });


export { prisma };
