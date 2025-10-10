/*
  Warnings:

  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sku` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "sku" SET NOT NULL;
