-- DropForeignKey
ALTER TABLE "dayActions" DROP CONSTRAINT "dayActions_dayId_fkey";

-- AddForeignKey
ALTER TABLE "dayActions" ADD CONSTRAINT "dayActions_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "days"("id") ON DELETE CASCADE ON UPDATE CASCADE;
