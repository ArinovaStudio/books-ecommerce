/*
  Warnings:

  - The values [BOOK] on the enum `ProductCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `totalPrize` on the `Kit` table. All the data in the column will be lost.
  - Added the required column `totalPrice` to the `Kit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductCategory_new" AS ENUM ('TEXTBOOK', 'NOTEBOOK', 'STATIONARY', 'OTHER');
ALTER TABLE "Product" ALTER COLUMN "category" TYPE "ProductCategory_new" USING ("category"::text::"ProductCategory_new");
ALTER TYPE "ProductCategory" RENAME TO "ProductCategory_old";
ALTER TYPE "ProductCategory_new" RENAME TO "ProductCategory";
DROP TYPE "public"."ProductCategory_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Kit" DROP CONSTRAINT "Kit_classId_fkey";

-- DropForeignKey
ALTER TABLE "KitItem" DROP CONSTRAINT "KitItem_kitId_fkey";

-- DropForeignKey
ALTER TABLE "KitItem" DROP CONSTRAINT "KitItem_productId_fkey";

-- AlterTable
ALTER TABLE "Kit" DROP COLUMN "totalPrize",
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kit" ADD CONSTRAINT "Kit_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitItem" ADD CONSTRAINT "KitItem_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "Kit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitItem" ADD CONSTRAINT "KitItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
