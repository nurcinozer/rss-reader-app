-- CreateTable
CREATE TABLE "Feed" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "link" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedItem" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "link" VARCHAR(255) NOT NULL,
    "feedId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feed_title_idx" ON "Feed"("title");

-- CreateIndex
CREATE INDEX "Feed_link_idx" ON "Feed"("link");

-- CreateIndex
CREATE INDEX "FeedItem_title_idx" ON "FeedItem"("title");

-- CreateIndex
CREATE INDEX "FeedItem_link_idx" ON "FeedItem"("link");
