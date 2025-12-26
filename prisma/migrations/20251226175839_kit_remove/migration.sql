/*
  Warnings:

  - You are about to drop the column `kitType` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Kit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Kit" DROP CONSTRAINT "Kit_classId_fkey";

-- DropForeignKey
ALTER TABLE "KitItem" DROP CONSTRAINT "KitItem_kitId_fkey";

-- DropForeignKey
ALTER TABLE "KitItem" DROP CONSTRAINT "KitItem_productId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "kitType";

-- DropTable
DROP TABLE "Kit";

-- DropTable
DROP TABLE "KitItem";

-- DropEnum
DROP TYPE "KitType";
