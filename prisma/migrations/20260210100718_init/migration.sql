-- CreateEnum
CREATE TYPE "CalendarFileType" AS ENUM ('ORIGINAL', 'COPY');

-- CreateEnum
CREATE TYPE "StageStatus" AS ENUM ('DRAFT', 'COMPLETE');

-- CreateEnum
CREATE TYPE "ThresholdOperator" AS ENUM ('GT', 'LT', 'GTE', 'LTE');

-- CreateEnum
CREATE TYPE "TenDay" AS ENUM ('FIRST', 'MIDDLE', 'LAST');

-- CreateEnum
CREATE TYPE "StageImageType" AS ENUM ('COVER', 'ALBUM');

-- CreateTable
CREATE TABLE "Crop" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndicatorCategory" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndicatorCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indicator" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "source" TEXT NOT NULL DEFAULT '',
    "defaultMin" DOUBLE PRECISION,
    "defaultMax" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Indicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "zoneName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneDistrict" (
    "zoneId" TEXT NOT NULL,
    "districtId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneDistrict_pkey" PRIMARY KEY ("zoneId","districtId")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "creatorId" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "fileType" "CalendarFileType" NOT NULL DEFAULT 'ORIGINAL',
    "allowCenterUse" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "lastEditedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
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
    "districtId" INTEGER NOT NULL,
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
CREATE TABLE "Stage" (
    "id" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "StageStatus" NOT NULL DEFAULT 'DRAFT',
    "color" TEXT NOT NULL DEFAULT '',
    "startTenDay" "TenDay",
    "startMonth" INTEGER,
    "endTenDay" "TenDay",
    "endMonth" INTEGER,
    "analysis" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "StageThreshold" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "operator" "ThresholdOperator" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "durationDays" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StageThreshold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gwl" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gwl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Crop_name_idx" ON "Crop"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IndicatorCategory_name_key" ON "IndicatorCategory"("name");

-- CreateIndex
CREATE INDEX "IndicatorCategory_order_idx" ON "IndicatorCategory"("order");

-- CreateIndex
CREATE INDEX "Indicator_categoryId_name_idx" ON "Indicator"("categoryId", "name");

-- CreateIndex
CREATE INDEX "Calendar_cropId_isShared_idx" ON "Calendar"("cropId", "isShared");

-- CreateIndex
CREATE INDEX "Calendar_isPublished_createdAt_idx" ON "Calendar"("isPublished", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Calendar_creatorId_idx" ON "Calendar"("creatorId");

-- CreateIndex
CREATE INDEX "CalendarZone_calendarId_idx" ON "CalendarZone"("calendarId");

-- CreateIndex
CREATE INDEX "CalendarZone_zoneId_idx" ON "CalendarZone"("zoneId");

-- CreateIndex
CREATE INDEX "CalendarIndicator_calendarId_idx" ON "CalendarIndicator"("calendarId");

-- CreateIndex
CREATE INDEX "CalendarIndicator_indicatorId_idx" ON "CalendarIndicator"("indicatorId");

-- CreateIndex
CREATE INDEX "Stage_calendarId_order_idx" ON "Stage"("calendarId", "order");

-- CreateIndex
CREATE INDEX "StageImage_stageId_type_idx" ON "StageImage"("stageId", "type");

-- CreateIndex
CREATE INDEX "StageThreshold_stageId_idx" ON "StageThreshold"("stageId");

-- AddForeignKey
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "IndicatorCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneDistrict" ADD CONSTRAINT "ZoneDistrict_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneDistrict" ADD CONSTRAINT "ZoneDistrict_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageImage" ADD CONSTRAINT "StageImage_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageThreshold" ADD CONSTRAINT "StageThreshold_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageThreshold" ADD CONSTRAINT "StageThreshold_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
