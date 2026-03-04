/*
  Warnings:

  - You are about to drop the column `coverName` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `coverSource` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `coverThumbnail` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `endDecade` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `startDecade` on the `Stage` table. All the data in the column will be lost.
  - The `startMonth` column on the `Stage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endMonth` column on the `Stage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `durationDays` column on the `StageThreshold` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Creator` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorName` to the `Calendar` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StageImageType" AS ENUM ('COVER', 'ALBUM');

-- DropForeignKey
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_creatorId_fkey";

-- AlterTable
ALTER TABLE "Calendar" ADD COLUMN     "creatorName" TEXT NOT NULL,
ADD COLUMN     "lastEditedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Stage" DROP COLUMN "coverName",
DROP COLUMN "coverSource",
DROP COLUMN "coverThumbnail",
DROP COLUMN "coverUrl",
DROP COLUMN "endDecade",
DROP COLUMN "startDecade",
ADD COLUMN     "analysis" JSONB,
ADD COLUMN     "endTenDay" "Decade",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "startTenDay" "Decade",
DROP COLUMN "startMonth",
ADD COLUMN     "startMonth" INTEGER,
DROP COLUMN "endMonth",
ADD COLUMN     "endMonth" INTEGER;

-- AlterTable
ALTER TABLE "StageThreshold" ADD COLUMN     "unit" TEXT,
DROP COLUMN "durationDays",
ADD COLUMN     "durationDays" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "Creator";

-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "zoneName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneDistrict" (
    "zoneId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneDistrict_pkey" PRIMARY KEY ("zoneId","districtId")
);

-- CreateTable
CREATE TABLE "CalendarZone" (
    "id" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "zoneName" TEXT NOT NULL,
    "cityCount" INTEGER NOT NULL DEFAULT 0,
    "districtCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarZoneDistrict" (
    "calendarZoneId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarZoneDistrict_pkey" PRIMARY KEY ("calendarZoneId","districtId")
);

-- CreateTable
CREATE TABLE "CalendarIndicator" (
    "id" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "nameSnapshot" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StageImage" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "type" "StageImageType" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "name" TEXT,
    "source" TEXT DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StageImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalendarZone_calendarId_idx" ON "CalendarZone"("calendarId");

-- CreateIndex
CREATE INDEX "CalendarZone_zoneId_idx" ON "CalendarZone"("zoneId");

-- CreateIndex
CREATE INDEX "CalendarIndicator_calendarId_idx" ON "CalendarIndicator"("calendarId");

-- CreateIndex
CREATE INDEX "CalendarIndicator_indicatorId_idx" ON "CalendarIndicator"("indicatorId");

-- CreateIndex
CREATE INDEX "StageImage_stageId_type_idx" ON "StageImage"("stageId", "type");

-- AddForeignKey
ALTER TABLE "ZoneDistrict" ADD CONSTRAINT "ZoneDistrict_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneDistrict" ADD CONSTRAINT "ZoneDistrict_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarZone" ADD CONSTRAINT "CalendarZone_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarZone" ADD CONSTRAINT "CalendarZone_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarZoneDistrict" ADD CONSTRAINT "CalendarZoneDistrict_calendarZoneId_fkey" FOREIGN KEY ("calendarZoneId") REFERENCES "CalendarZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarZoneDistrict" ADD CONSTRAINT "CalendarZoneDistrict_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarIndicator" ADD CONSTRAINT "CalendarIndicator_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarIndicator" ADD CONSTRAINT "CalendarIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageImage" ADD CONSTRAINT "StageImage_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
