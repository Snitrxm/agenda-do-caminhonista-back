/*
  Warnings:

  - Added the required column `updatedAt` to the `days` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "days" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "dayActions" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "additionalInformations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dayActions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dayActions_action_idx" ON "dayActions"("action");

-- AddForeignKey
ALTER TABLE "dayActions" ADD CONSTRAINT "dayActions_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "days"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
