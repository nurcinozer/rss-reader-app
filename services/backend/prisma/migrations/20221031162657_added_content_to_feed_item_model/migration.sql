/*
  Warnings:

  - Added the required column `content` to the `FeedItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FeedItem" ADD COLUMN     "content" TEXT NOT NULL;
