-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
