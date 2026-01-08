/*
  Warnings:

  - Added the required column `sectionId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactQuery" ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "pincode" TEXT;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "pincode" TEXT,
ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "sectionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "pincode" TEXT;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
