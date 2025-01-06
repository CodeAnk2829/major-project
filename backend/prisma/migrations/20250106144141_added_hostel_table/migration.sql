/*
  Warnings:

  - The values [STUDENT,FACULTY,ISSUE_INCHARGE,RESOLVER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `upvote` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('COMPLAINER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'COMPLAINER';
COMMIT;

-- DropForeignKey
ALTER TABLE "upvote" DROP CONSTRAINT "upvote_complaintId_fkey";

-- DropForeignKey
ALTER TABLE "upvote" DROP CONSTRAINT "upvote_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'COMPLAINER';

-- DropTable
DROP TABLE "upvote";

-- CreateTable
CREATE TABLE "Hostel" (
    "id" TEXT NOT NULL,
    "hostelNumber" INTEGER NOT NULL,
    "block" TEXT NOT NULL,
    "inchargeId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resolver" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,

    CONSTRAINT "Resolver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upvote" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "complaintId" TEXT NOT NULL,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hostel_inchargeId_key" ON "Hostel"("inchargeId");

-- CreateIndex
CREATE UNIQUE INDEX "Hostel_hostelNumber_inchargeId_key" ON "Hostel"("hostelNumber", "inchargeId");

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_key" ON "Upvote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_complaintId_key" ON "Upvote"("userId", "complaintId");

-- AddForeignKey
ALTER TABLE "Hostel" ADD CONSTRAINT "Hostel_inchargeId_fkey" FOREIGN KEY ("inchargeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
