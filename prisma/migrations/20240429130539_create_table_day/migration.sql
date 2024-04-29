-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "days_date_idx" ON "days"("date");

-- AddForeignKey
ALTER TABLE "days" ADD CONSTRAINT "days_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
