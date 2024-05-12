-- AlterTable
ALTER TABLE "days" ADD COLUMN     "arriveKm" INTEGER,
ADD COLUMN     "departureKm" INTEGER,
ADD COLUMN     "weekStart" BOOLEAN NOT NULL DEFAULT false;
