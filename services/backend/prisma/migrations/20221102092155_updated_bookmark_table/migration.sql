/*
  Warnings:

  - You are about to drop the column `bookmark` on the `Bookmark` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bookmark" DROP COLUMN "bookmark",
ADD COLUMN     "content" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "link" VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN     "title" VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "FeedItem" ALTER COLUMN "title" SET DEFAULT '',
ALTER COLUMN "link" SET DEFAULT '',
ALTER COLUMN "content" SET DEFAULT '';
