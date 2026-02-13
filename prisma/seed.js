const prisma = require("../src/db/prisma");
const {
  gwls,
  crops,
  cities,
  zones,
  calendars,
  calendarDetails,
  stages,
  indicatorCategories,
  indicators,
} = require("../src/data/mockData");
const {
  tenDayLabelToEnum,
  fileTypeToEnum,
  stageStatusToEnum,
  operatorToEnum,
} = require("../src/services/mappers");

const seedCities = async () => {
  for (const city of cities) {
    const cityId = Number(city.id);
    await prisma.city.upsert({
      where: { id: cityId },
      update: { name: city.name },
      create: { id: cityId, name: city.name },
    });
    for (const district of city.districts) {
      const districtId = Number(district.id);
      await prisma.district.upsert({
        where: { id: districtId },
        update: { name: district.name, cityId: cityId },
        create: { id: districtId, name: district.name, cityId: cityId },
      });
    }
  }
};

const seedCrops = async () => {
  for (const crop of crops) {
    await prisma.crop.upsert({
      where: { id: crop.id },
      update: { name: crop.name },
      create: { id: crop.id, name: crop.name },
    });
  }
};

const seedIndicators = async () => {
  const categoryIds = [];
  for (const category of indicatorCategories) {
    const created = await prisma.indicatorCategory.upsert({
      where: { id: category.id },
      update: { name: category.name },
      create: { id: category.id, name: category.name },
    });
    categoryIds.push(created.id);
  }

  const defaultCategoryId = categoryIds[0];
  for (const indicator of indicators) {
    await prisma.indicator.upsert({
      where: { id: indicator.id },
      update: {
        name: indicator.name,
        unit: indicator.unit,
        categoryId: defaultCategoryId,
      },
      create: {
        id: indicator.id,
        name: indicator.name,
        unit: indicator.unit,
        categoryId: defaultCategoryId,
      },
    });
  }
};

const seedGwls = async () => {
  for (const gwl of gwls) {
    const gwlId = Number(gwl.id);
    await prisma.gwl.upsert({
      where: { id: gwlId },
      update: { name: gwl.name },
      create: { id: gwlId, name: gwl.name },
    });
  }
};

const seedZones = async () => {
  for (const zone of zones) {
    const zoneId = String(zone.id);
    await prisma.zone.upsert({
      where: { id: zoneId },
      update: { zoneName: zone.zone_name },
      create: { id: zoneId, zoneName: zone.zone_name },
    });

    const districtIds = zone.cities.flatMap((city) => city.districts.map((d) => d.id));
    await prisma.zoneDistrict.deleteMany({ where: { zoneId } });
    if (districtIds.length > 0) {
      await prisma.zoneDistrict.createMany({
        data: districtIds.map((districtId) => ({
          zoneId,
          districtId: Number(districtId),
        })),
      });
    }
  }
};

const seedCalendars = async () => {
  const cropId = crops[0]?.id;
  if (!cropId) return;

  for (const calendar of calendars) {
    await prisma.calendar.upsert({
      where: { id: calendar.id },
      update: {
        title: calendar.title,
        creatorId: calendar.creator?.id || "user_001",
        creatorName: calendar.creator?.name || "專家A",
        isShared: calendar.is_shared,
        isPublished: calendar.is_published,
        fileType: fileTypeToEnum(calendar.file_type),
        allowCenterUse: calendar.allow_center_use || false,
        publishedAt: calendar.published_at ? new Date(calendar.published_at) : null,
        lastEditedAt: calendar.last_edited_at
          ? new Date(calendar.last_edited_at)
          : new Date(),
      },
      create: {
        id: calendar.id,
        cropId,
        title: calendar.title,
        creatorId: calendar.creator?.id || "user_001",
        creatorName: calendar.creator?.name || "專家A",
        isShared: calendar.is_shared,
        isPublished: calendar.is_published,
        fileType: fileTypeToEnum(calendar.file_type),
        allowCenterUse: calendar.allow_center_use || false,
        publishedAt: calendar.published_at ? new Date(calendar.published_at) : null,
        lastEditedAt: calendar.last_edited_at
          ? new Date(calendar.last_edited_at)
          : new Date(),
      },
    });

    // 讓 seed 可重複執行：先清掉該栽培曆既有關聯，再重建
    await prisma.calendarZone.deleteMany({ where: { calendarId: calendar.id } });
    await prisma.calendarIndicator.deleteMany({ where: { calendarId: calendar.id } });

    if (calendar.zone) {
      const zoneId = String(calendar.zone.id);
      const cityCount = calendar.zone.cities?.length || 0;
      const districtIds = calendar.zone.cities.flatMap((city) =>
        city.districts.map((d) => d.id),
      );

      const cz = await prisma.calendarZone.create({
        data: {
          calendarId: calendar.id,
          zoneId,
          zoneName: calendar.zone.zone_name,
          cityCount,
          districtCount: districtIds.length,
        },
      });

      if (districtIds.length > 0) {
        await prisma.calendarZoneDistrict.createMany({
          data: districtIds.map((districtId) => ({
            calendarZoneId: cz.id,
            districtId: Number(districtId),
          })),
        });
      }
    }

    if (calendar.indicators && calendar.indicators.length > 0) {
      await prisma.calendarIndicator.createMany({
        data: calendar.indicators.map((ind) => ({
          calendarId: calendar.id,
          indicatorId: ind.id,
          nameSnapshot: ind.name,
        })),
      });
    }
  }
};

const seedStages = async () => {
  const calendarId = calendars[0]?.id;
  if (!calendarId) return;

  for (const stage of stages) {
    const startMonthRaw = stage.start_date_range?.month;
    const endMonthRaw = stage.end_date_range?.month;
    const startMonth = startMonthRaw === undefined || startMonthRaw === null
      ? null
      : Number(startMonthRaw);
    const endMonth = endMonthRaw === undefined || endMonthRaw === null
      ? null
      : Number(endMonthRaw);

    const created = await prisma.stage.upsert({
      where: { id: stage.id },
      update: {
        calendarId,
        name: stage.name,
        description: stage.description || "",
        status: stageStatusToEnum(stage.status),
        color: stage.color || "",
        startTenDay: tenDayLabelToEnum(stage.start_date_range?.name),
        startMonth,
        endTenDay: tenDayLabelToEnum(stage.end_date_range?.name),
        endMonth,
        analysis: calendarDetails[0]?.analysis || null,
      },
      create: {
        id: stage.id,
        calendarId,
        name: stage.name,
        description: stage.description || "",
        status: stageStatusToEnum(stage.status),
        color: stage.color || "",
        startTenDay: tenDayLabelToEnum(stage.start_date_range?.name),
        startMonth,
        endTenDay: tenDayLabelToEnum(stage.end_date_range?.name),
        endMonth,
        analysis: calendarDetails[0]?.analysis || null,
      },
    });

    await prisma.stageImage.deleteMany({ where: { stageId: created.id } });

    if (stage.cover_image) {
      const coverId = stage.cover_image.id
        ? `${stage.id}_${stage.cover_image.id}`
        : undefined;
      await prisma.stageImage.create({
        data: {
          id: coverId ? String(coverId) : undefined,
          stageId: created.id,
          type: "COVER",
          url: stage.cover_image.url,
          thumbnail: stage.cover_image.thumbnail,
          name: stage.cover_image.name,
          source: stage.cover_image.source,
          sortOrder: 0,
        },
      });
    }

    if (stage.album && stage.album.length > 0) {
      await prisma.stageImage.createMany({
        data: stage.album.map((img) => ({
          id: img.id ? String(`${stage.id}_${img.id}`) : undefined,
          stageId: created.id,
          type: "ALBUM",
          url: img.url,
          thumbnail: img.thumbnail,
          name: img.name,
          source: img.source,
          sortOrder: img.sort_order || 0,
        })),
      });
    }
  }
};

const seedThresholds = async () => {
  const stage = stages[0];
  if (!stage || !stage.thresholds) return;

  await prisma.stageThreshold.deleteMany({ where: { stageId: stage.id } });
  if (stage.thresholds.length > 0) {
    await prisma.stageThreshold.createMany({
      data: stage.thresholds.map((t) => ({
        stageId: stage.id,
        indicatorId: t.indicator_id,
        operator: operatorToEnum(t.operator),
        value: t.value,
        unit: t.unit,
        durationDays: t.duration_days || 1,
      })),
    });
  }
};

const main = async () => {
  await seedCities();
  await seedCrops();
  await seedIndicators();
  await seedGwls();
  await seedZones();
  await seedCalendars();
  await seedStages();
  await seedThresholds();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
