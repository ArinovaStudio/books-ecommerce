/*
  Warnings:

  - You are about to drop the column `landmark` on the `ContactQuery` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `ContactQuery` table. All the data in the column will be lost.
  - You are about to drop the column `landmark` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `landmark` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `landmark` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `User` table. All the data in the column will be lost.
  - Added the required column `landmark` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactQuery" DROP COLUMN "landmark",
DROP COLUMN "pincode";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "landmark" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "pincode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "landmark",
DROP COLUMN "pincode";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "landmark",
DROP COLUMN "pincode";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "landmark",
DROP COLUMN "pincode";
