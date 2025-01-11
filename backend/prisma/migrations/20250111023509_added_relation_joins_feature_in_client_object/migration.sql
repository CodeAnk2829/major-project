/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Resolver` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Complaint" ALTER COLUMN "access" SET DEFAULT 'PRIVATE',
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Resolver" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'RESOLVER';

-- CreateIndex
CREATE UNIQUE INDEX "Resolver_email_key" ON "Resolver"("email");
