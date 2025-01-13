/*
  Warnings:

  - You are about to drop the column `email` on the `Resolver` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Resolver` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Resolver` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Resolver` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[location,locationName,locationBlock]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resolverId]` on the table `Resolver` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `Resolver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resolverId` to the `Resolver` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Location_locationName_locationBlock_key";

-- DropIndex
DROP INDEX "Resolver_email_key";

-- AlterTable
ALTER TABLE "Resolver" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phoneNumber",
DROP COLUMN "role",
ADD COLUMN     "locationId" INTEGER NOT NULL,
ADD COLUMN     "resolverId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Location_location_locationName_locationBlock_key" ON "Location"("location", "locationName", "locationBlock");

-- CreateIndex
CREATE UNIQUE INDEX "Resolver_resolverId_key" ON "Resolver"("resolverId");

-- AddForeignKey
ALTER TABLE "Resolver" ADD CONSTRAINT "Resolver_resolverId_fkey" FOREIGN KEY ("resolverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resolver" ADD CONSTRAINT "Resolver_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
