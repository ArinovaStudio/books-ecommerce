/*
  Warnings:

  - You are about to drop the column `kitType` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "kitType";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "firstLanguage" TEXT,
ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "pincode" TEXT;

-- CreateTable
CREATE TABLE "ContactQuery" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactQuery_pkey" PRIMARY KEY ("id")
);
