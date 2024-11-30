/*
  Warnings:

  - The `price` column on the `Models` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Models" DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION;
