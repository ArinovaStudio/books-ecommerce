-- CreateTable
CREATE TABLE "ApiTraffic" (
    "id" TEXT NOT NULL,
    "hour" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ApiTraffic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiTraffic_hour_key" ON "ApiTraffic"("hour");
