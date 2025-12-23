-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('pending', 'approved', 'rejected', 'funded', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "SubStepState" AS ENUM ('pending', 'in_progress', 'validated', 'failed');

-- CreateTable
CREATE TABLE "PME" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PME_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pmeId" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'pending',
    "requestedAmount" DOUBLE PRECISION NOT NULL,
    "fundedAmount" DOUBLE PRECISION,
    "fundDisbursementDates" TIMESTAMP(3)[],
    "validatedAt" TIMESTAMP(3),
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubStep" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "state" "SubStepState" NOT NULL DEFAULT 'pending',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "remarks" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectValidators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectValidators_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SubStepValidators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubStepValidators_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "PME_email_key" ON "PME"("email");

-- CreateIndex
CREATE INDEX "_ProjectValidators_B_index" ON "_ProjectValidators"("B");

-- CreateIndex
CREATE INDEX "_SubStepValidators_B_index" ON "_SubStepValidators"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_pmeId_fkey" FOREIGN KEY ("pmeId") REFERENCES "PME"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubStep" ADD CONSTRAINT "SubStep_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectValidators" ADD CONSTRAINT "_ProjectValidators_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectValidators" ADD CONSTRAINT "_ProjectValidators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubStepValidators" ADD CONSTRAINT "_SubStepValidators_A_fkey" FOREIGN KEY ("A") REFERENCES "SubStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubStepValidators" ADD CONSTRAINT "_SubStepValidators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
