/*
  Warnings:

  - You are about to drop the column `creatorName` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `lastEditedAt` on the `Calendar` table. All the data in the column will be lost.
  - The primary key for the `City` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Crop` table. All the data in the column will be lost.
  - The primary key for the `District` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `District` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `District` table. All the data in the column will be lost.
  - The primary key for the `Gwl` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Gwl` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Gwl` table. All the data in the column will be lost.
  - You are about to drop the column `defaultMax` on the `Indicator` table. All the data in the column will be lost.
  - You are about to drop the column `defaultMin` on the `Indicator` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Indicator` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `IndicatorCategory` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `IndicatorCategory` table. All the data in the column will be lost.
  - You are about to drop the column `analysis` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `endTenDay` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `startTenDay` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `StageThreshold` table. All the data in the column will be lost.
  - You are about to drop the `CalendarIndicator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CalendarZone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CalendarZoneDistrict` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StageImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Zone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZoneDistrict` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Decade" AS ENUM ('UPPER', 'MIDDLE', 'LOWER');

-- DropForeignKey
ALTER TABLE "CalendarIndicator" DROP CONSTRAINT "CalendarIndicator_calendarId_fkey";

-- DropForeignKey
ALTER TABLE "CalendarIndicator" DROP CONSTRAINT "CalendarIndicator_indicatorId_fkey";

-- DropForeignKey
ALTER TABLE "CalendarZone" DROP CONSTRAINT "CalendarZone_calendarId_fkey";

-- DropForeignKey
ALTER TABLE "CalendarZone" DROP CONSTRAINT "CalendarZone_zoneId_fkey";

-- DropForeignKey
ALTER TABLE "CalendarZoneDistrict" DROP CONSTRAINT "CalendarZoneDistrict_calendarZoneId_fkey";

-- DropForeignKey
ALTER TABLE "CalendarZoneDistrict" DROP CONSTRAINT "CalendarZoneDistrict_districtId_fkey";

-- DropForeignKey
ALTER TABLE "District" DROP CONSTRAINT "District_cityId_fkey";

-- DropForeignKey
ALTER TABLE "StageImage" DROP CONSTRAINT "StageImage_stageId_fkey";

-- DropForeignKey
ALTER TABLE "ZoneDistrict" DROP CONSTRAINT "ZoneDistrict_districtId_fkey";

-- DropForeignKey
ALTER TABLE "ZoneDistrict" DROP CONSTRAINT "ZoneDistrict_zoneId_fkey";

-- DropIndex
DROP INDEX "IndicatorCategory_order_idx";

-- DropIndex
DROP INDEX "Stage_calendarId_order_idx";

-- AlterTable
ALTER TABLE "Calendar" DROP COLUMN "creatorName",
DROP COLUMN "lastEditedAt",
ADD COLUMN     "sharedAt" TIMESTAMP(3),
ADD COLUMN     "sourceCalendarId" TEXT,
ADD COLUMN     "zoneName" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "City" DROP CONSTRAINT "City_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "City_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Crop" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "District" DROP CONSTRAINT "District_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "cityId" SET DATA TYPE TEXT,
ADD CONSTRAINT "District_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Gwl" DROP CONSTRAINT "Gwl_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Gwl_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Indicator" DROP COLUMN "defaultMax",
DROP COLUMN "defaultMin",
DROP COLUMN "description";

-- AlterTable
ALTER TABLE "IndicatorCategory" DROP COLUMN "description",
DROP COLUMN "order";

-- AlterTable
ALTER TABLE "Stage" DROP COLUMN "analysis",
DROP COLUMN "endTenDay",
DROP COLUMN "order",
DROP COLUMN "startTenDay",
ADD COLUMN     "coverName" TEXT,
ADD COLUMN     "coverSource" TEXT,
ADD COLUMN     "coverThumbnail" TEXT,
ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "endDecade" "Decade",
ADD COLUMN     "startDecade" "Decade",
ALTER COLUMN "startMonth" SET DATA TYPE TEXT,
ALTER COLUMN "endMonth" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StageThreshold" DROP COLUMN "unit",
ALTER COLUMN "durationDays" SET DEFAULT '1',
ALTER COLUMN "durationDays" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "CalendarIndicator";

-- DropTable
DROP TABLE "CalendarZone";

-- DropTable
DROP TABLE "CalendarZoneDistrict";

-- DropTable
DROP TABLE "StageImage";

-- DropTable
DROP TABLE "Zone";

-- DropTable
DROP TABLE "ZoneDistrict";

-- DropEnum
DROP TYPE "StageImageType";

-- DropEnum
DROP TYPE "TenDay";

-- CreateTable
CREATE TABLE "Creator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarDistrict" (
    "calendarId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarDistrict_pkey" PRIMARY KEY ("calendarId","cityId","districtId")
);

-- CreateTable
CREATE TABLE "StageAlbum" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "thumbnail" TEXT,
    "source" TEXT DEFAULT '',
    "sortOrder" TEXT NOT NULL DEFAULT '0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StageAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StageAlbum_stageId_idx" ON "StageAlbum"("stageId");

-- CreateIndex
CREATE INDEX "Stage_calendarId_idx" ON "Stage"("calendarId");

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_sourceCalendarId_fkey" FOREIGN KEY ("sourceCalendarId") REFERENCES "Calendar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarDistrict" ADD CONSTRAINT "CalendarDistrict_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarDistrict" ADD CONSTRAINT "CalendarDistrict_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarDistrict" ADD CONSTRAINT "CalendarDistrict_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageAlbum" ADD CONSTRAINT "StageAlbum_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
