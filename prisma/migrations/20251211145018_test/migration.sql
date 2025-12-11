/*
  Warnings:

  - Made the column `numberOfClasses` on table `School` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "School" ALTER COLUMN "numberOfClasses" SET NOT NULL;
