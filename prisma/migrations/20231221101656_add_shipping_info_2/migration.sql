/*
  Warnings:

  - Added the required column `stateOrProvince` to the `ShippingInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShippingInformation" ADD COLUMN     "stateOrProvince" TEXT NOT NULL;
