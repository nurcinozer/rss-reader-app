/*
  Warnings:

  - The primary key for the `Auth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Auth_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");
