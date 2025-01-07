/*
  Warnings:

  - You are about to drop the column `location` on the `IssueIncharge` table. All the data in the column will be lost.
  - You are about to drop the column `locationBlock` on the `IssueIncharge` table. All the data in the column will be lost.
  - You are about to drop the column `locationName` on the `IssueIncharge` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[locationId,designation]` on the table `IssueIncharge` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `IssueIncharge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IssueIncharge" DROP COLUMN "location",
DROP COLUMN "locationBlock",
DROP COLUMN "locationName",
ADD COLUMN     "locationId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "locationBlock" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_locationName_locationBlock_key" ON "Location"("locationName", "locationBlock");

-- CreateIndex
CREATE UNIQUE INDEX "IssueIncharge_locationId_designation_key" ON "IssueIncharge"("locationId", "designation");

-- AddForeignKey
ALTER TABLE "IssueIncharge" ADD CONSTRAINT "IssueIncharge_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
