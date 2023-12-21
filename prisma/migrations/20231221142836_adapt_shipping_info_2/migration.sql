-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingInfoId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingInfoId_fkey" FOREIGN KEY ("shippingInfoId") REFERENCES "ShippingInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
