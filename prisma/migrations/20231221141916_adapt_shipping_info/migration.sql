/*
  Warnings:

  - You are about to drop the column `address` on the `ShippingInformation` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `ShippingInformation` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `ShippingInformation` table. All the data in the column will be lost.
  - Added the required column `addressLine1` to the `ShippingInformation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ShippingInformation_userId_isDefault_key";

-- AlterTable
ALTER TABLE "ShippingInformation" DROP COLUMN "address",
DROP COLUMN "isDefault",
DROP COLUMN "surname",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT;
