const prisma = require("../db/prisma");
const {
  tenDayLabelToEnum,
  tenDayDecadeToEnum,
  tenDayEnumToDecade,
  fileTypeToString,
  stageStatusToEnum,
  stageStatusToString,
  operatorToEnum,
  operatorToString,
} = require("./mappers");
const { generateId } = require("./id");

const formatDateTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const buildZoneView = (
  calendarZone,
  { includeCalendarId = true, includeZoneId = true } = {},
) => {
  const zone = calendarZone.zone;
  const zoneName = calendarZone.zoneName || zone.zoneName;
  const districts = calendarZone.districts?.map((d) => d.district) || [];
  const cityMap = new Map();

  districts.forEach((district) => {
    const city = district.city;
    if (!cityMap.has(city.id)) {
      cityMap.set(city.id, { id: city.id, name: city.name, districts: [] });
    }
    cityMap
      .get(city.id)
      .districts.push({ id: district.id, name: district.name });
  });

  const payload = {};
  if (includeCalendarId) {
    payload.calendar_id = calendarZone.calendarId;
  }
  if (includeZoneId) {
    payload.id = zone.id;
  }
  payload.zone_name = zoneName;
  payload.cities = Array.from(cityMap.values());
  return payload;
};

const extractStageBaseId = (id) => {
  const match = String(id).match(/stage_\d+/);
  return match ? match[0] : String(id);
};

const resolveStageId = (calendarId, stageId) => {
  if (!calendarId || !stageId) return stageId;
  const stageIdStr = String(stageId)
    .replace(/^"+|"+$/g, "")
    .replace(/^'+|'+$/g, "");
  if (stageIdStr.startsWith(`${calendarId}_`)) return stageIdStr;
  if (/^stage_\d+/.test(stageIdStr)) return `${calendarId}_${stageIdStr}`;
  return stageIdStr;
};

const tenDayPayloadToEnum = (range) =>
  tenDayDecadeToEnum(range?.decade) ?? tenDayLabelToEnum(range?.name);

const TEN_DAY_ORDER = {
  upper: 1,
  middle: 2,
  lower: 3,
};

const filterMonthlyDataByRange = (monthlyData = [], startRange, endRange) => {
  if (!Array.isArray(monthlyData) || monthlyData.length === 0) return [];
  const startMonth = startRange?.month ? Number(startRange.month) : null;
  const endMonth = endRange?.month ? Number(endRange.month) : null;
  const startDecade = startRange?.decade;
  const endDecade = endRange?.decade;
  if (!startMonth || !endMonth) return monthlyData;

  const startOrder = TEN_DAY_ORDER[startDecade] || null;
  const endOrder = TEN_DAY_ORDER[endDecade] || null;

  return monthlyData
    .filter((monthEntry) => {
      const monthNum = Number(monthEntry.month);
      return monthNum >= startMonth && monthNum <= endMonth;
    })
    .map((monthEntry) => {
      const monthNum = Number(monthEntry.month);
      const decadeData = Array.isArray(monthEntry.decade_data)
        ? monthEntry.decade_data
        : [];

      if (!startOrder || !endOrder || decadeData.length === 0) {
        return monthEntry;
      }

      let filteredDecades = decadeData;
      if (startMonth === endMonth && monthNum === startMonth) {
        filteredDecades = decadeData.filter((d) => {
          const order = TEN_DAY_ORDER[d.decade];
          return order >= startOrder && order <= endOrder;
        });
      } else if (monthNum === startMonth) {
        filteredDecades = decadeData.filter((d) => {
          const order = TEN_DAY_ORDER[d.decade];
          return order >= startOrder;
        });
      } else if (monthNum === endMonth) {
        filteredDecades = decadeData.filter((d) => {
          const order = TEN_DAY_ORDER[d.decade];
          return order <= endOrder;
        });
      }

      if (filteredDecades.length === 0) return null;
      return { ...monthEntry, decade_data: filteredDecades };
    })
    .filter(Boolean);
};

const buildAnalysisForStage = (calendar, stageId) => {
  const stages = calendar?.stages || [];
  let stage = stages[0] || null;

  if (stageId) {
    const resolvedStageId = resolveStageId(calendar?.id, stageId);
    stage = stages.find((s) => s.id === resolvedStageId) || stage;
  }

  if (!stage || !stage.analysis) {
    return { indicators: [] };
  }

  const startRange = stage.startMonth
    ? {
        month: String(stage.startMonth),
        decade: tenDayEnumToDecade(stage.startTenDay),
      }
    : null;
  const endRange = stage.endMonth
    ? {
        month: String(stage.endMonth),
        decade: tenDayEnumToDecade(stage.endTenDay),
      }
    : null;

  if (!startRange || !endRange) return stage.analysis;

  const decadeToStartDay = (decade) => {
    switch (decade) {
      case "upper":
        return 1;
      case "middle":
        return 11;
      case "lower":
        return 21;
      default:
        return 1;
    }
  };

  const decadeToEndDay = (decade) => {
    switch (decade) {
      case "upper":
        return 10;
      case "middle":
        return 20;
      case "lower":
        return 31;
      default:
        return 31;
    }
  };

  const toOrder = (month, day) => Number(month) * 100 + Number(day);

  const parseDateParts = (value) => {
    if (!value) return null;
    const raw = String(value);
    const parts = raw.split("-");
    if (parts.length >= 3) {
      return {
        year: Number(parts[0]),
        month: Number(parts[1]),
        day: Number(parts[2]),
      };
    }
    if (raw.includes("/")) {
      const slashParts = raw.split("/");
      if (slashParts.length >= 3) {
        return {
          year: Number(slashParts[0]),
          month: Number(slashParts[1]),
          day: Number(slashParts[2]),
        };
      }
    }
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return {
        year: parsed.getUTCFullYear(),
        month: parsed.getUTCMonth() + 1,
        day: parsed.getUTCDate(),
      };
    }
    return null;
  };

  const formatDate = (month, day) =>
    `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const buildMonthlyExceedCount = (
    dailyData,
    threshold = {},
    monthsFilter = null,
  ) => {
    if (!Array.isArray(dailyData)) return [];
    const currentThreshold = Number(threshold.current);
    const futureThreshold = Number(threshold.future);
    const allowedMonths =
      Array.isArray(monthsFilter) && monthsFilter.length > 0
        ? new Set(monthsFilter.map(String))
        : null;

    const byMonth = new Map();
    dailyData.forEach((item) => {
      const parts = parseDateParts(item?.date);
      if (!parts?.month) return;
      const monthKey = String(parts.month);
      if (allowedMonths && !allowedMonths.has(monthKey)) return;
      if (!byMonth.has(monthKey)) {
        byMonth.set(monthKey, { current: 0, future: 0 });
      }
      const counts = byMonth.get(monthKey);
      const currentValue = Number(item?.value?.current);
      const futureValue = Number(item?.value?.future);
      if (!Number.isNaN(currentThreshold) && !Number.isNaN(currentValue)) {
        if (currentValue > currentThreshold) counts.current += 1;
      }
      if (!Number.isNaN(futureThreshold) && !Number.isNaN(futureValue)) {
        if (futureValue > futureThreshold) counts.future += 1;
      }
    });

    return Array.from(byMonth.entries())
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([month, exceedCount]) => ({
        month,
        exceed_count: {
          current: String(exceedCount.current),
          future: String(exceedCount.future),
        },
      }));
  };

  const lastDayOfMonth = (year, month) =>
    new Date(Date.UTC(year, month, 0)).getUTCDate();

  const monthsInRange = (rangeStart, rangeEnd) => {
    const startMonth = Number(rangeStart?.month);
    const endMonth = Number(rangeEnd?.month);
    if (!startMonth || !endMonth) return [];
    if (endMonth >= startMonth) {
      return Array.from(
        { length: endMonth - startMonth + 1 },
        (_, i) => String(startMonth + i),
      );
    }
    return [
      ...Array.from({ length: 12 - startMonth + 1 }, (_, i) =>
        String(startMonth + i),
      ),
      ...Array.from({ length: endMonth }, (_, i) => String(i + 1)),
    ];
  };

  const expandDailyDataForMonths = (dailyData, months) => {
    if (!Array.isArray(dailyData) || months.length === 0) return dailyData;

    const firstDate = dailyData.find((d) => d?.date)?.date || null;
    const firstParts = parseDateParts(firstDate);
    const baseYear = firstParts?.year || new Date().getUTCFullYear();

    const map = new Map();
    dailyData.forEach((item) => {
      const parts = parseDateParts(item?.date);
      if (!parts) return;
      const key = formatDate(parts.month, parts.day);
      map.set(key, { ...item, date: key });
    });

    const expanded = [];
    months.forEach((monthStr) => {
      const month = Number(monthStr);
      const days = lastDayOfMonth(baseYear, month);
      for (let day = 1; day <= days; day += 1) {
        const key = formatDate(month, day);
        const existing = map.get(key);
        if (existing) {
          expanded.push(existing);
          continue;
        }
        const current = (Math.random() * 40).toFixed(1);
        const future = (Math.random() * 40).toFixed(1);
        expanded.push({
          date: key,
          value: { current, future },
        });
      }
    });

    return expanded;
  };

  const expandDailyDataByRange = (dailyData, rangeStart, rangeEnd) => {
    if (!Array.isArray(dailyData) || !rangeStart || !rangeEnd) return dailyData;

    const firstDate = dailyData.find((d) => d?.date)?.date || null;
    const firstParts = parseDateParts(firstDate);
    const baseYear = firstParts?.year || new Date().getUTCFullYear();

    const startDay = decadeToStartDay(rangeStart.decade);
    const endDay = Math.min(
      decadeToEndDay(rangeEnd.decade),
      lastDayOfMonth(baseYear, Number(rangeEnd.month)),
    );

    const startMonth = Number(rangeStart.month);
    const endMonth = Number(rangeEnd.month);
    const spansYear = endMonth < startMonth;

    const startDate = new Date(
      Date.UTC(baseYear, startMonth - 1, startDay),
    );
    const endDate = new Date(
      Date.UTC(baseYear + (spansYear ? 1 : 0), endMonth - 1, endDay),
    );

    const map = new Map();
    dailyData.forEach((item) => {
      const parts = parseDateParts(item?.date);
      if (!parts) return;
      const key = formatDate(parts.month, parts.day);
      map.set(key, { ...item, date: key });
    });

    const expanded = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d = new Date(d.getTime() + 24 * 60 * 60 * 1000)
    ) {
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth() + 1;
      const day = d.getUTCDate();
      const key = formatDate(month, day);
      const existing = map.get(key);
      if (existing) {
        expanded.push(existing);
        continue;
      }
      const current = (Math.random() * 40).toFixed(1);
      const future = (Math.random() * 40).toFixed(1);
      expanded.push({
        date: key,
        value: { current, future },
      });
    }

    return expanded;
  };

  const filterDailyDataByRange = (dailyData, rangeStart, rangeEnd) => {
    if (!Array.isArray(dailyData) || !rangeStart || !rangeEnd) return dailyData;
    const startDay = decadeToStartDay(rangeStart.decade);
    const endDay = decadeToEndDay(rangeEnd.decade);
    const startOrder = toOrder(rangeStart.month, startDay);
    const endOrder = toOrder(rangeEnd.month, endDay);

    return dailyData
      .filter((item) => {
      if (!item?.date) return false;
      const parts = parseDateParts(item.date);
      if (!parts?.month || !parts?.day) return false;
      const month = parts.month;
      const day = parts.day;
      const order = toOrder(month, day);
      if (endOrder >= startOrder) {
        return order >= startOrder && order <= endOrder;
      }
      // 跨年情境
      return order >= startOrder || order <= endOrder;
    })
      .map((item) => {
        const parts = parseDateParts(item?.date);
        if (!parts?.month || !parts?.day) return item;
        return { ...item, date: formatDate(parts.month, parts.day) };
      });
  };

  const indicators = Array.isArray(stage.analysis.indicators)
    ? stage.analysis.indicators.map((indicator) => {
        if (Array.isArray(indicator.daily_data)) {
          const filteredDaily = filterDailyDataByRange(
            indicator.daily_data,
            startRange,
            endRange,
          );
          const months = monthsInRange(startRange, endRange);
          const monthlyDaily = expandDailyDataForMonths(
            indicator.daily_data,
            months,
          );
          const { exceed_count, ...rest } = indicator;
          return {
            ...rest,
            daily_data: expandDailyDataByRange(
              filteredDaily,
              startRange,
              endRange,
            ),
            monthly_exceed_count: buildMonthlyExceedCount(
              monthlyDaily,
              indicator.threshold,
              months,
            ),
          };
        }
        if (Array.isArray(indicator.monthly_data)) {
          return {
            ...indicator,
            monthly_data: filterMonthlyDataByRange(
              indicator.monthly_data,
              startRange,
              endRange,
            ),
          };
        }
        return indicator;
      })
    : stage.analysis.indicators;

  return { ...stage.analysis, indicators };
};

const buildStageListItem = (stage) => {
  const baseId = extractStageBaseId(stage.id);
  return {
    id: baseId,
    name: stage.name,
    sort_order: stage.order ?? 0,
    start_date_range: stage.startMonth
      ? {
          id: `start_${baseId}`,
          decade: tenDayEnumToDecade(stage.startTenDay),
          month: String(stage.startMonth),
        }
      : null,
    end_date_range: stage.endMonth
      ? {
          id: `end_${baseId}`,
          decade: tenDayEnumToDecade(stage.endTenDay),
          month: String(stage.endMonth),
        }
      : null,
    status: stageStatusToString(stage.status),
  };
};

const buildStageSummary = (stage) => {
  const baseId = extractStageBaseId(stage.id);
  return {
    id: stage.id,
    name: stage.name,
    sort_order: stage.order ?? 0,
    description: stage.description || "",
    cover_image: (() => {
      const cover = (stage.images || []).find((img) => img.type === "COVER");
      return cover
        ? {
            id: cover.id,
            url: cover.url,
            thumbnail: cover.thumbnail,
            name: cover.name,
            source: cover.source || "",
          }
        : null;
    })(),
    start_date_range: stage.startMonth
      ? {
          id: `start_${baseId}`,
          decade: tenDayEnumToDecade(stage.startTenDay),
          month: String(stage.startMonth),
        }
      : null,
    end_date_range: stage.endMonth
      ? {
          id: `end_${baseId}`,
          decade: tenDayEnumToDecade(stage.endTenDay),
          month: String(stage.endMonth),
        }
      : null,
    status: stageStatusToString(stage.status),
    color: stage.color || "",
    album: (stage.images || [])
      .filter((img) => img.type === "ALBUM")
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((img) => ({
        id: img.id,
        url: img.url,
        thumbnail: img.thumbnail,
        name: img.name,
        source: img.source || "",
        sort_order: img.sortOrder || 0,
      })),
  };
};

const buildStageDetail = (stage) => {
  const baseId = extractStageBaseId(stage.id);
  const cover = stage.images.find((img) => img.type === "COVER");
  const album = stage.images
    .filter((img) => img.type === "ALBUM")
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return {
    id: stage.id,
    name: stage.name,
    sort_order: stage.order ?? 0,
    description: stage.description || "",
    start_date_range: stage.startMonth
      ? {
          id: `start_${baseId}`,
          decade: tenDayEnumToDecade(stage.startTenDay),
          month: String(stage.startMonth),
        }
      : null,
    end_date_range: stage.endMonth
      ? {
          id: `end_${baseId}`,
          decade: tenDayEnumToDecade(stage.endTenDay),
          month: String(stage.endMonth),
        }
      : null,
    status: stageStatusToString(stage.status),
    color: stage.color || "",
    cover_image: cover
      ? {
          id: cover.id,
          url: cover.url,
          thumbnail: cover.thumbnail,
          name: cover.name,
          source: cover.source || "",
        }
      : null,
    album: album.map((img) => ({
      id: img.id,
      url: img.url,
      thumbnail: img.thumbnail,
      name: img.name,
      source: img.source || "",
      sort_order: img.sortOrder || 0,
    })),
  };
};

const defaultPermissions = () => ({
  canEdit: false,
  canDelete: false,
});

const getCrops = async () =>
  prisma.crop.findMany({ select: { id: true, name: true } });

const getGwls = async () =>
  prisma.gwl.findMany({ select: { id: true, name: true } });

const getCities = async () =>
  prisma.city.findMany({
    select: {
      id: true,
      name: true,
      districts: { select: { id: true, name: true } },
    },
    orderBy: { id: "asc" },
  });

const getZonesByCrop = async (cropId) => {
  const calendarZones = await prisma.calendarZone.findMany({
    where: { calendar: { cropId } },
    include: {
      zone: true,
      districts: { include: { district: { include: { city: true } } } },
    },
  });

  const zoneMap = new Map();
  calendarZones.forEach((cz) => {
    if (!zoneMap.has(cz.zoneId)) {
      zoneMap.set(cz.zoneId, buildZoneView(cz, { includeZoneId: false }));
    }
  });

  return Array.from(zoneMap.values());
};

const getStagesByCrop = async (cropId) => {
  const stages = await prisma.stage.findMany({
    where: { calendar: { cropId } },
    select: { id: true, name: true, order: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const stageMap = new Map();
  stages.forEach((stage) => {
    const baseId = extractStageBaseId(stage.id);
    if (stageMap.has(baseId)) return;
    stageMap.set(baseId, {
      id: baseId,
      name: stage.name,
      sort_order: stage.order ?? 0,
    });
  });

  return Array.from(stageMap.values());
};

const getCalendarsByCrop = async (cropId, options = {}) => {
  const {
    userId = null,
    role = null,
    isShared = undefined,
    isPublished = undefined,
  } = options;

  let where = { cropId };
  let visibility = null;

  if (role === "admin" || role === "center") {
    visibility = null;
  } else if (userId) {
    visibility = {
      OR: [{ isPublished: true }, { isShared: true }, { creatorId: userId }],
    };
  } else {
    visibility = { isPublished: true };
  }

  const filters = [];
  if (visibility) filters.push(visibility);
  if (isShared !== undefined) filters.push({ isShared });
  if (isPublished !== undefined) filters.push({ isPublished });

  if (filters.length > 0) {
    where.AND = filters;
  }

  const calendars = await prisma.calendar.findMany({
    where,
    include: {
      calendarZones: {
        include: {
          zone: true,
          districts: { include: { district: { include: { city: true } } } },
        },
      },
      calendarIndicators: {
        include: { indicator: { include: { category: true } } },
      },
      stages: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return calendars.map((cal) => {
    const zones = cal.calendarZones.map((cz) =>
      buildZoneView(cz, { includeCalendarId: true, includeZoneId: false })
    );
    const zone = zones[0] || null;
    const indicatorCategories = Array.from(
      new Map(
        cal.calendarIndicators
          .map((ci) => ci.indicator?.category)
          .filter(Boolean)
          .map((category) => [category.id, { id: category.id, name: category.name }]),
      ).values(),
    ).sort((a, b) => String(a.id).localeCompare(String(b.id)));

    return {
      id: cal.id,
      source_calendar_id: cal.sourceCalendarId || null,
      title: cal.title,
      creator: { id: cal.creatorId, name: cal.creatorName },
      permissions: defaultPermissions(),
      is_shared: cal.isShared,
      is_published: cal.isPublished,
      file_type: fileTypeToString(cal.fileType),
      allow_center_use: cal.allowCenterUse,
      published_at: formatDateTime(cal.publishedAt),
      updated_at: formatDateTime(cal.lastEditedAt),
      zone,
      stages: cal.stages.map(buildStageListItem),
      indicator_categories: indicatorCategories,
    };
  });
};

const getGwlNameById = async (gwlId) => {
  if (!gwlId) return null;
  const gwl = await prisma.gwl.findUnique({
    where: { id: String(gwlId) },
    select: { name: true },
  });
  return gwl?.name || null;
};

const adjustFuturePair = (current, future) => {
  if (current === null || current === undefined) return { current, future };
  if (future === null || future === undefined) return { current, future };
  const currentNum = Number(current);
  const futureNum = Number(future);
  if (!Number.isFinite(currentNum) || !Number.isFinite(futureNum)) {
    return { current, future };
  }
  if (Math.abs(currentNum - futureNum) > 1e-9) {
    return { current, future };
  }
  const hasDecimal =
    String(current).includes(".") || String(future).includes(".");
  const bumped = currentNum + (hasDecimal ? 0.5 : 1);
  return {
    current: String(current),
    future: hasDecimal ? bumped.toFixed(1) : String(Math.round(bumped)),
  };
};

const adjustIndicatorFutureValues = (indicator) => {
  const threshold = indicator.threshold || {};
  const exceed = indicator.exceed_count || {};
  const adjustedThreshold = adjustFuturePair(threshold.current, threshold.future);
  const adjustedExceed = adjustFuturePair(exceed.current, exceed.future);

  const dailyData = Array.isArray(indicator.daily_data)
    ? indicator.daily_data.map((entry) => {
        const adjustedValue = adjustFuturePair(
          entry?.value?.current,
          entry?.value?.future
        );
        return {
          ...entry,
          value: { ...entry.value, ...adjustedValue },
        };
      })
    : indicator.daily_data;

  return {
    ...indicator,
    threshold: { ...threshold, ...adjustedThreshold },
    exceed_count: { ...exceed, ...adjustedExceed },
    daily_data: dailyData,
  };
};

const applyGwlToAnalysis = (analysis, gwlName) => {
  if (!analysis) return analysis;
  const indicators = Array.isArray(analysis.indicators)
    ? analysis.indicators.map(adjustIndicatorFutureValues)
    : analysis.indicators;

  return {
    ...analysis,
    gwl: gwlName || analysis.gwl,
    indicators,
  };
};

const getCalendarDetail = async (calendarId, stageId, gwlId) => {
  const calendar = await prisma.calendar.findUnique({
    where: { id: calendarId },
    include: {
      crop: true,
      calendarZones: {
        include: {
          zone: true,
          districts: { include: { district: { include: { city: true } } } },
        },
      },
      stages: {
        include: {
          images: true,
          thresholds: true,
        },
        orderBy: { order: "asc" },
      },
      calendarIndicators: { include: { indicator: true } },
    },
  });

  if (!calendar) return null;

  const zones = calendar.calendarZones.map((cz) =>
    buildZoneView(cz, { includeCalendarId: true, includeZoneId: false })
  );
  const zone = zones[0] || null;
  const analysis = buildAnalysisForStage(calendar, stageId);
  const gwlName = await getGwlNameById(gwlId);

  return {
    id: calendar.id,
    title: calendar.title,
    permissions: defaultPermissions(),
    creator_id: calendar.creatorId,
    crop_name: calendar.crop?.name || "",
    updated_at: calendar.lastEditedAt.toISOString(),
    is_published: calendar.isPublished,
    is_shared: calendar.isShared,
    source_calendar_id: calendar.sourceCalendarId || null,
    zone,
    stages: calendar.stages.map(buildStageSummary),
    analysis: applyGwlToAnalysis(analysis, gwlName),
  };
};

const getCalendarAccess = async (calendarId) => {
  return prisma.calendar.findUnique({
    where: { id: calendarId },
    select: {
      id: true,
      creatorId: true,
      sourceCalendarId: true,
      isPublished: true,
      isShared: true,
      allowCenterUse: true,
    },
  });
};

const getStageCalendarId = async (stageId) => {
  const stage = await prisma.stage.findUnique({
    where: { id: stageId },
    select: { calendarId: true },
  });
  return stage?.calendarId || null;
};

const createCalendar = async ({
  cropId,
  title,
  creatorId,
  creatorName,
  zoneName,
  districtIds = [],
  zoneIds = [],
}) => {
  const zones = [];

  if (zoneIds.length > 0) {
    const existingZones = await prisma.zone.findMany({
      where: { id: { in: zoneIds.map((id) => String(id)) } },
    });
    existingZones.forEach((zone) =>
      zones.push({ zoneId: zone.id, zoneName: zone.zoneName }),
    );
  } else if (zoneName) {
    const zone = await prisma.zone.create({
      data: {
        zoneName,
        zoneDistricts: {
          create: districtIds.map((districtId) => ({ districtId })),
        },
      },
    });
    zones.push({ zoneId: zone.id, zoneName });
  }

  const calendar = await prisma.calendar.create({
    data: {
      cropId,
      title,
      creatorId,
      creatorName,
      lastEditedAt: new Date(),
      calendarZones: {
        create: zones.map((z) => ({
          zoneId: z.zoneId,
          zoneName: z.zoneName,
          cityCount: 0,
          districtCount: districtIds.length,
          districts: {
            create: districtIds.map((districtId) => ({ districtId })),
          },
        })),
      },
    },
  });

  return calendar;
};

const updateCalendar = async (calendarId, payload) => {
  const { title, zoneName, districtIds } = payload;
  const updateData = {
    lastEditedAt: new Date(),
  };
  if (title !== undefined) updateData.title = title;

  const calendar = await prisma.calendar.update({
    where: { id: calendarId },
    data: updateData,
  });

  if (zoneName !== undefined || districtIds !== undefined) {
    const calendarZone = await prisma.calendarZone.findFirst({
      where: { calendarId },
      orderBy: { createdAt: "asc" },
    });

    if (calendarZone) {
      if (zoneName !== undefined) {
        await prisma.zone.update({
          where: { id: calendarZone.zoneId },
          data: { zoneName },
        });
        await prisma.calendarZone.update({
          where: { id: calendarZone.id },
          data: { zoneName },
        });
      }

      if (Array.isArray(districtIds)) {
        await prisma.calendarZoneDistrict.deleteMany({
          where: { calendarZoneId: calendarZone.id },
        });
        await prisma.calendarZoneDistrict.createMany({
          data: districtIds.map((districtId) => ({
            calendarZoneId: calendarZone.id,
            districtId,
          })),
        });
      }
    }
  }

  return calendar;
};

const deleteCalendar = async (calendarId) => {
  await prisma.calendar.delete({ where: { id: calendarId } });
};

const shareCalendar = async (calendarId) => {
  return prisma.calendar.update({
    where: { id: calendarId },
    data: { isShared: true, lastEditedAt: new Date() },
  });
};

const publishCalendar = async (calendarId, isPublished) => {
  return prisma.calendar.update({
    where: { id: calendarId },
    data: {
      isPublished,
      publishedAt: isPublished ? new Date() : null,
      lastEditedAt: new Date(),
    },
  });
};

const copyCalendar = async (calendarId, creatorId, creatorName) => {
  const calendar = await prisma.calendar.findUnique({
    where: { id: calendarId },
    include: {
      calendarZones: {
        include: { districts: true },
      },
      calendarIndicators: true,
      stages: {
        include: { images: true, thresholds: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!calendar) return null;

  return prisma.$transaction(async (tx) => {
    const newCalendar = await tx.calendar.create({
      data: {
        cropId: calendar.cropId,
        title: `${calendar.title}（副本）`,
        creatorId,
        creatorName,
        sourceCalendarId: calendar.id,
        isShared: false,
        isPublished: false,
        fileType: "COPY",
        allowCenterUse: calendar.allowCenterUse,
        publishedAt: null,
        lastEditedAt: new Date(),
      },
    });

    if (calendar.calendarZones.length > 0) {
      for (const cz of calendar.calendarZones) {
        const newCz = await tx.calendarZone.create({
          data: {
            calendarId: newCalendar.id,
            zoneId: cz.zoneId,
            zoneName: cz.zoneName,
            cityCount: cz.cityCount,
            districtCount: cz.districtCount,
          },
        });
        if (cz.districts.length > 0) {
          await tx.calendarZoneDistrict.createMany({
            data: cz.districts.map((d) => ({
              calendarZoneId: newCz.id,
              districtId: d.districtId,
            })),
          });
        }
      }
    }

    if (calendar.calendarIndicators.length > 0) {
      await tx.calendarIndicator.createMany({
        data: calendar.calendarIndicators.map((ci) => ({
          calendarId: newCalendar.id,
          indicatorId: ci.indicatorId,
          nameSnapshot: ci.nameSnapshot,
        })),
      });
    }

    if (calendar.stages.length > 0) {
      for (const stage of calendar.stages) {
        const newStage = await tx.stage.create({
          data: {
            calendarId: newCalendar.id,
            order: stage.order,
            name: stage.name,
            description: stage.description,
            status: stage.status,
            color: stage.color,
            startTenDay: stage.startTenDay,
            startMonth: stage.startMonth,
            endTenDay: stage.endTenDay,
            endMonth: stage.endMonth,
            analysis: stage.analysis,
          },
        });

        if (stage.images.length > 0) {
          await tx.stageImage.createMany({
            data: stage.images.map((img) => ({
              stageId: newStage.id,
              type: img.type,
              url: img.url,
              thumbnail: img.thumbnail,
              name: img.name,
              source: img.source,
              sortOrder: img.sortOrder,
            })),
          });
        }

        if (stage.thresholds.length > 0) {
          await tx.stageThreshold.createMany({
            data: stage.thresholds.map((t) => ({
              stageId: newStage.id,
              indicatorId: t.indicatorId,
              operator: t.operator,
              value: t.value,
              unit: t.unit,
              durationDays: t.durationDays,
            })),
          });
        }
      }
    }

    return newCalendar;
  });
};

const getStageList = async (calendarId) => {
  const stages = await prisma.stage.findMany({
    where: { calendarId },
    select: { id: true, name: true, order: true },
    orderBy: { order: "asc" },
  });
  return stages.map((stage) => ({
    id: stage.id,
    name: stage.name,
    sort_order: stage.order,
  }));
};

const getStageDetail = async (calendarId, stageId) => {
  if (stageId === undefined) {
    stageId = calendarId;
    calendarId = null;
  }
  const resolvedStageId = resolveStageId(calendarId, stageId);
  const stage = await prisma.stage.findUnique({
    where: { id: resolvedStageId },
    include: { images: true, thresholds: true },
  });
  if (!stage) return null;
  return buildStageDetail(stage);
};

const createStage = async ({ calendarId, payload }) => {
  const {
    name,
    description,
    start_date_range,
    end_date_range,
    color,
    status,
    thresholds = [],
  } = payload;

  const stage = await prisma.stage.create({
    data: {
      calendarId,
      name,
      description: description || "",
      startTenDay: tenDayPayloadToEnum(start_date_range),
      startMonth: start_date_range?.month || null,
      endTenDay: tenDayPayloadToEnum(end_date_range),
      endMonth: end_date_range?.month || null,
      status: stageStatusToEnum(status),
      color: color || "",
      thresholds: {
        create: thresholds.map((t) => ({
          indicatorId: t.indicator_id,
          operator: operatorToEnum(t.operator),
          value: t.value,
          unit: t.unit,
          durationDays: t.duration_days || 1,
        })),
      },
    },
  });

  return stage;
};

const updateStage = async ({ calendarId, stageId, payload }) => {
  const {
    name,
    description,
    start_date_range,
    end_date_range,
    color,
    status,
    thresholds,
  } = payload;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (color !== undefined) updateData.color = color;
  if (status !== undefined) updateData.status = stageStatusToEnum(status);
  if (start_date_range !== undefined) {
    updateData.startTenDay = tenDayPayloadToEnum(start_date_range);
    updateData.startMonth = start_date_range?.month || null;
  }
  if (end_date_range !== undefined) {
    updateData.endTenDay = tenDayPayloadToEnum(end_date_range);
    updateData.endMonth = end_date_range?.month || null;
  }

  const resolvedStageId = resolveStageId(calendarId, stageId);
  const stage = await prisma.stage.update({
    where: { id: resolvedStageId },
    data: updateData,
  });

  if (thresholds !== undefined) {
    await prisma.stageThreshold.deleteMany({
      where: { stageId: resolvedStageId },
    });
    if (thresholds.length > 0) {
      await prisma.stageThreshold.createMany({
        data: thresholds.map((t) => ({
          stageId: resolvedStageId,
          indicatorId: t.indicator_id,
          operator: operatorToEnum(t.operator),
          value: t.value,
          unit: t.unit,
          durationDays: t.duration_days || 1,
        })),
      });
    }
  }

  return stage;
};

const deleteStage = async (calendarId, stageId) => {
  const resolvedStageId = resolveStageId(calendarId, stageId);
  await prisma.stage.delete({ where: { id: resolvedStageId } });
};

const updateStageOrder = async (calendarId, orders = []) => {
  const stages = await prisma.stage.findMany({
    where: { calendarId },
    select: { id: true },
    orderBy: { order: "asc" },
  });

  if (stages.length !== orders.length) {
    throw new Error("STAGE_ORDER_INCOMPLETE");
  }

  const stageIds = new Set(stages.map((stage) => stage.id));
  const payloadIds = new Set();
  const sortOrders = new Set();

  for (const item of orders) {
    if (!item || !item.id || !Number.isInteger(item.sort_order)) {
      throw new Error("STAGE_ORDER_INVALID");
    }
    if (!stageIds.has(item.id)) {
      throw new Error("STAGE_ORDER_OUT_OF_SCOPE");
    }
    if (payloadIds.has(item.id) || sortOrders.has(item.sort_order)) {
      throw new Error("STAGE_ORDER_DUPLICATED");
    }

    payloadIds.add(item.id);
    sortOrders.add(item.sort_order);
  }

  if (payloadIds.size !== stageIds.size) {
    throw new Error("STAGE_ORDER_INCOMPLETE");
  }

  await prisma.$transaction(async (tx) => {
    for (const item of orders) {
      await tx.stage.update({
        where: { id: item.id },
        data: { order: item.sort_order },
      });
    }

    await tx.calendar.update({
      where: { id: calendarId },
      data: { lastEditedAt: new Date() },
    });
  });
};

const addStageCover = async ({ stageId, source, file }) => {
  const coverId = generateId("img");
  const created = await prisma.stageImage.create({
    data: {
      id: coverId,
      stageId,
      type: "COVER",
      url: `https://placeholder.com/cover_${coverId}.jpg`,
      thumbnail: `https://placeholder.com/cover_${coverId}_thumb.jpg`,
      name: file ? file.originalname : "",
      source: source || "",
      sortOrder: 0,
    },
  });
  return created;
};

const updateStageCover = async ({ stageId, source, file, coverImageId }) => {
  const existing = await prisma.stageImage.findFirst({
    where: { stageId, type: "COVER" },
  });

  // 情況 1：上傳新圖片（優先級最高）
  if (file) {
    if (existing) {
      await prisma.stageImage.delete({ where: { id: existing.id } });
    }
    return addStageCover({ stageId, source, file });
  }

  // 情況 2：刪除封面圖（coverImageId 為 null 或 "null"）
  if (coverImageId === null || coverImageId === "null") {
    if (!existing) {
      return null; // 本來就沒有封面圖，返回 null
    }
    await prisma.stageImage.delete({ where: { id: existing.id } });
    return { deleted: true, id: existing.id };
  }

  // 情況 3：保留現有封面圖，更新 source
  if (coverImageId) {
    if (!existing) {
      return null; // 沒有現有封面圖，無法保留
    }
    // 驗證 coverImageId 是否與現有封面圖一致
    if (existing.id !== coverImageId) {
      throw new Error(
        `cover_image_id (${coverImageId}) 與現有封面圖 (${existing.id}) 不符`,
      );
    }
    // 更新 source
    if (source !== undefined) {
      return prisma.stageImage.update({
        where: { id: existing.id },
        data: { source },
      });
    }
    return existing;
  }

  // 情況 4：只更新 source
  if (!existing) {
    return null;
  }

  if (source !== undefined) {
    return prisma.stageImage.update({
      where: { id: existing.id },
      data: { source },
    });
  }

  return existing;
};

const addStageAlbum = async ({ stageId, source, files, sortOrders = [] }) => {
  const existing = await prisma.stageImage.findMany({
    where: { stageId, type: "ALBUM" },
    orderBy: { sortOrder: "asc" },
  });
  const maxOrder = existing.reduce(
    (max, img) => Math.max(max, img.sortOrder || 0),
    -1,
  );

  const created = await prisma.$transaction(
    files.map((file, index) => {
      const photoId = generateId("img");
      // 使用傳入的 sortOrder，如果沒有則自動遞增
      const sortOrder =
        sortOrders[index] !== undefined
          ? parseInt(sortOrders[index], 10)
          : maxOrder + 1 + index;

      return prisma.stageImage.create({
        data: {
          id: photoId,
          stageId,
          type: "ALBUM",
          url: `https://placeholder.com/album_${photoId}.jpg`,
          thumbnail: `https://placeholder.com/album_${photoId}_thumb.jpg`,
          name: file.originalname,
          source: source || "",
          sortOrder,
        },
      });
    }),
  );

  return created;
};

const updateStageAlbum = async ({
  stageId,
  images = [],
  source,
  files = [],
}) => {
  // 1. 取得 DB 中現有的所有相簿圖片
  const existingImages = await prisma.stageImage.findMany({
    where: { stageId, type: "ALBUM" },
  });

  // 2. 從 images 陣列中取得要保留的 ID
  const keepIds = images.filter((img) => img.id).map((img) => img.id);

  // 3. 找出要刪除的圖片
  const toDelete = existingImages
    .filter((img) => !keepIds.includes(img.id))
    .map((img) => img.id);

  // 4. 找出新圖片的索引（沒有 id 的元素）
  const newImageIndices = images
    .map((img, index) => ({ ...img, index }))
    .filter((img) => !img.id);

  // 5. 驗證新圖片數量與上傳檔案數量一致
  if (newImageIndices.length !== files.length) {
    throw new Error(
      `新圖片數量 (${newImageIndices.length}) 與上傳檔案數量 (${files.length}) 不符`,
    );
  }

  // 6. 使用 transaction 執行所有操作
  const result = await prisma.$transaction(async (tx) => {
    const createdIds = [];
    const updatedIds = [];

    // 6.1 刪除不在列表中的圖片
    if (toDelete.length > 0) {
      await tx.stageImage.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    // 6.2 新增圖片
    for (let i = 0; i < newImageIndices.length; i++) {
      const imgConfig = newImageIndices[i];
      const file = files[i];
      const photoId = generateId("img");

      await tx.stageImage.create({
        data: {
          id: photoId,
          stageId,
          type: "ALBUM",
          url: `https://placeholder.com/album_${photoId}.jpg`,
          thumbnail: `https://placeholder.com/album_${photoId}_thumb.jpg`,
          name: file.originalname,
          source: source || "",
          sortOrder: imgConfig.sort_order,
        },
      });

      createdIds.push(photoId);
    }

    // 6.3 更新現有圖片的 sort_order（以及可選的 source）
    for (const img of images.filter((img) => img.id)) {
      const updateData = {
        sortOrder: img.sort_order,
      };

      // 如果有提供 source，也一併更新
      if (source !== undefined) {
        updateData.source = source;
      }

      await tx.stageImage.update({
        where: { id: img.id },
        data: updateData,
      });

      updatedIds.push(img.id);
    }

    return { createdIds, updatedIds, deletedIds: toDelete };
  });

  return result;
};

const getIndicatorCategories = async () =>
  prisma.indicatorCategory.findMany({ select: { id: true, name: true } });

const getIndicators = async (categoryId) => {
  const where = categoryId ? { categoryId } : undefined;
  return prisma.indicator.findMany({
    where,
    select: { id: true, name: true, unit: true },
  });
};

module.exports = {
  getCrops,
  getGwls,
  getCities,
  getZonesByCrop,
  getStagesByCrop,
  getCalendarsByCrop,
  getCalendarDetail,
  getCalendarAccess,
  getStageCalendarId,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  shareCalendar,
  publishCalendar,
  copyCalendar,
  getStageList,
  getStageDetail,
  createStage,
  resolveStageId,
  updateStage,
  deleteStage,
  updateStageOrder,
  addStageCover,
  updateStageCover,
  addStageAlbum,
  updateStageAlbum,
  getIndicatorCategories,
  getIndicators,
};
