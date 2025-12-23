import { PrismaClient } from '../generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import dotenv from'dotenv'

dotenv.config({path : './backend/.env'});
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaNeon({ connectionString })
export const prisma = new PrismaClient({ adapter })


