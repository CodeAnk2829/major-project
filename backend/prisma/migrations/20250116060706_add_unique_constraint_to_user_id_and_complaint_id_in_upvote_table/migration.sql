/*
  Warnings:

  - A unique constraint covering the columns `[userId,complaintId]` on the table `Upvote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Upvote_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_complaintId_key" ON "Upvote"("userId", "complaintId");
