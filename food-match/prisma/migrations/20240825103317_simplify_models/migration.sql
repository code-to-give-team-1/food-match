/*
  Warnings:

  - You are about to drop the `Beneficiary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Donor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Beneficiary" DROP CONSTRAINT "Beneficiary_userId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_beneficiaryId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_donorId_fkey";

-- DropForeignKey
ALTER TABLE "Donor" DROP CONSTRAINT "Donor_userId_fkey";

-- AlterTable
ALTER TABLE "Donation" ALTER COLUMN "beneficiaryId" DROP NOT NULL;

-- DropTable
DROP TABLE "Beneficiary";

-- DropTable
DROP TABLE "Donor";

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
