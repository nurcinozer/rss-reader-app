/*
  Warnings:

  - You are about to drop the column `isStarred` on the `FeedItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeedItem" DROP COLUMN "isStarred";

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" SERIAL NOT NULL,
    "bookmark" BOOLEAN NOT NULL DEFAULT false,
    "feedItemId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_feedItemId_key" ON "Bookmark"("feedItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_key" ON "Bookmark"("userId");
