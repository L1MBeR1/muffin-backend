/*
  Warnings:

  - You are about to drop the column `patronymic` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "patronymic",
ADD COLUMN     "birth_date" TIMESTAMP(3),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(150);
