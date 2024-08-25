/*
  Warnings:

  - You are about to drop the `_DonationToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DonationToTag" DROP CONSTRAINT "_DonationToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_DonationToTag" DROP CONSTRAINT "_DonationToTag_B_fkey";

-- DropTable
DROP TABLE "_DonationToTag";

-- CreateTable
CREATE TABLE "_DonationTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DonationTags_AB_unique" ON "_DonationTags"("A", "B");

-- CreateIndex
CREATE INDEX "_DonationTags_B_index" ON "_DonationTags"("B");

-- AddForeignKey
ALTER TABLE "_DonationTags" ADD CONSTRAINT "_DonationTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DonationTags" ADD CONSTRAINT "_DonationTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
