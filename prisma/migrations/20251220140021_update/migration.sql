/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classRange` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `School` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `School` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `School` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "School" ADD COLUMN     "classRange" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "languages" TEXT[],
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "address" SET DATA TYPE TEXT,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "board" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "School_email_key" ON "School"("email");
