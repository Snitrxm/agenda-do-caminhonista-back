-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "defaultTruckPlate" TEXT,
    "defaultTrailerPlate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
