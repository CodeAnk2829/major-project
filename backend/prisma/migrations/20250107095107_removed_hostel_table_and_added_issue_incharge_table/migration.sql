/*
  Warnings:

  - You are about to drop the `Hostel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hostel" DROP CONSTRAINT "Hostel_inchargeId_fkey";

-- DropTable
DROP TABLE "Hostel";

-- CreateTable
CREATE TABLE "IssueIncharge" (
    "id" TEXT NOT NULL,
    "inchargeId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "locationBlock" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "IssueIncharge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IssueIncharge_inchargeId_key" ON "IssueIncharge"("inchargeId");

-- AddForeignKey
ALTER TABLE "IssueIncharge" ADD CONSTRAINT "IssueIncharge_inchargeId_fkey" FOREIGN KEY ("inchargeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
