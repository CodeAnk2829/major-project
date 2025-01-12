-- AlterTable
ALTER TABLE "ComplaintDetail" ADD COLUMN     "upvotes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "locationName" DROP NOT NULL,
ALTER COLUMN "locationBlock" DROP NOT NULL;
