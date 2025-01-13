/*
  Warnings:

  - Added the required column `pickedBy` to the `ComplaintDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ComplaintDetail" ADD COLUMN     "pickedBy" TEXT NOT NULL,
ALTER COLUMN "assignedTo" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ComplaintDetail" ADD CONSTRAINT "ComplaintDetail_pickedBy_fkey" FOREIGN KEY ("pickedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
