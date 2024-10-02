/*
  Warnings:

  - The `status` column on the `order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'processing', 'assembling', 'delivery', 'completed', 'cancelled');

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "address_id" INTEGER,
ADD COLUMN     "bakery_id" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus";

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_bakery_id_fkey" FOREIGN KEY ("bakery_id") REFERENCES "bakery"("bakery_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
