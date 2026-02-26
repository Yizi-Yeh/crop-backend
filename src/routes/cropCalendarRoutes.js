const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/auth");
const { optionalAuth } = require("../middleware/auth");
const {
  getCrops,
  getGwls,
  getCities,
  getZonesByCrop,
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
  updateStage,
  deleteStage,
  addStageCover,
  updateStageCover,
  addStageAlbum,
  updateStageAlbum,
  getIndicatorCategories,
  getIndicators,
} = require("../services/cropCalendarService");

// multer 設定（記憶體儲存，用於圖片上傳）
const upload = multer({ storage: multer.memoryStorage() });

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 權限備註：
// - expert: 可看「自己 + 已發布 + 已共享」；只能操作自己；可分享，不可發布；可複製自己
// - center:
//   - 原稿 allow_center_use=true: 可看、可複製
//   - 原稿 allow_center_use=false: 只可看
//   - 副本: 可看、可公開、可編輯、可刪除
// - admin:
//   - 原稿 allow_center_use=true: 可看、可複製、可分享、可編輯、可刪除
//   - 原稿 allow_center_use=false: 可看、可分享、可編輯、可刪除
//   - 副本: 可看、可公開、可分享、可編輯、可刪除
// - 無 token: 只能看已發布
const canViewUnpublished = (user, calendar) => {
  if (!user) return false;
  if (user.role === "admin" || user.role === "center") return true;
  if (user.role === "expert") return calendar.creatorId === user.id;
  return false;
};

const canEditCalendar = (user, calendar) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role === "expert") return calendar.creatorId === user.id;
  if (user.role === "center") return calendar.sourceCalendarId != null;
  return false;
};

const canCopyCalendar = (user, calendar) => {
  if (!user) return false;
  if (calendar.sourceCalendarId) return false;
  if (user.role === "admin") return calendar.allowCenterUse === true;
  if (user.role === "center") return calendar.allowCenterUse === true;
  if (user.role === "expert") return calendar.creatorId === user.id;
  return false;
};

const canPublishCalendar = (user, calendar) => {
  if (!user) return false;
  if (!calendar.sourceCalendarId) return false;
  if (user.role === "admin") return true;
  if (user.role === "center") return true;
  return false;
};

const requireCalendarPermission = async (req, res, calendarId, action) => {
  const calendar = await getCalendarAccess(calendarId);
  if (!calendar) {
    res.status(404).json({ status: "error", message: "找不到該栽培曆" });
    return null;
  }
  const user = req.user;
  let allowed = false;
  if (action === "edit" || action === "delete") allowed = canEditCalendar(user, calendar);
  if (action === "copy") allowed = canCopyCalendar(user, calendar);
  if (action === "publish") allowed = canPublishCalendar(user, calendar);
  if (action === "share") {
    if (user?.role === "admin") allowed = true;
    if (user?.role === "expert") allowed = calendar.creatorId === user.id;
  }
  if (!allowed) {
    res.status(403).json({ status: "error", message: "沒有權限操作該栽培曆" });
    return null;
  }
  return calendar;
};

// ============================================
// 一、作物管理
// ============================================

/**
 * 作物清單
 * GET /api/crop-calendars/crops
 */
router.get(
  "/crops",
  asyncHandler(async (req, res) => {
    const crops = await getCrops();
    res.json({ status: "ok", message: "success", data: crops });
  }),
);

/**
 * 情境清單
 * GET /api/crop-calendars/gwls
 */
router.get(
  "/gwls",
  asyncHandler(async (req, res) => {
    const gwls = await getGwls();
    res.json({ status: "ok", message: "success", data: gwls });
  }),
);

/**
 * 縣市鄉鎮清單
 * GET /api/crop-calendars/cities
 */
router.get(
  "/cities",
  asyncHandler(async (req, res) => {
    const cities = await getCities();
    res.json({ status: "ok", message: "success", data: cities });
  }),
);

// ============================================
// 二、區域管理
// ============================================

/**
 * 栽培曆區域清單
 * GET /api/crop-calendars/crops/:cropId/zones
 */
router.get(
  "/crops/:cropId/zones",
  asyncHandler(async (req, res) => {
    const { cropId } = req.params;

    const crop = (await getCrops()).find((c) => c.id === cropId);
    if (!crop) {
      return res.status(404).json({ status: "error", message: "找不到該作物" });
    }

    const zones = await getZonesByCrop(cropId);
    res.json({ status: "ok", message: "success", data: zones });
  }),
);

// ============================================
// 三、栽培曆管理
// ============================================

/**
 * 栽培曆清單
 * GET /api/crop-calendars/crops/:cropId/calendars
 * Query: is_shared → 'true' | 'false' | 不帶（回傳所有）
 *        is_published → 'true' | 'false' | 不帶（回傳所有）
 */
router.get(
  "/crops/:cropId/calendars",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { cropId } = req.params;
    const { is_shared, is_published } = req.query;

    const crop = (await getCrops()).find((c) => c.id === cropId);
    if (!crop) {
      return res.status(404).json({ status: "error", message: "找不到該作物" });
    }

    const calendars = await getCalendarsByCrop(cropId, {
      userId: req.user?.id || null,
      role: req.user?.role || null,
      isShared: is_shared === undefined ? undefined : is_shared === "true",
      isPublished: is_published === undefined ? undefined : is_published === "true",
    });
    res.json({ status: "ok", message: "success", data: calendars });
  }),
);

/**
 * 栽培曆詳細
 * GET /api/crop-calendars/crops/:cropId/calendars/:calendarId
 * Query: city_id, gwl_id, source_id
 */
router.get(
  "/crops/:cropId/calendars/:calendarId",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { cropId, calendarId } = req.params;
    const { city_id, stage_id } = req.query;

    const crop = (await getCrops()).find((c) => c.id === cropId);
    if (!crop) {
      return res.status(404).json({ status: "error", message: "找不到該作物" });
    }

    const calendarDetail = await getCalendarDetail(calendarId, stage_id);
    if (!calendarDetail) {
      return res.status(200).json({ status: "ok", message: "success", data: [] });
    }

    if (
      !calendarDetail.is_published &&
      !calendarDetail.is_shared &&
      (!req.user || req.user.id !== calendarDetail.creator_id)
    ) {
      return res.status(200).json({ status: "ok", message: "success", data: [] });
    }

    let result = { ...calendarDetail };

    if (city_id) {
      const zone = result.zone;
      if (zone) {
        const cities = zone.cities.filter((city) => city.id === Number(city_id));
        result.zone = cities.length > 0 ? { ...zone, cities } : null;
      }
    }

    res.json({ status: "ok", message: "success", data: result });
  }),
);

/**
 * 新增栽培曆
 * POST /api/crop-calendars/crops/:cropId/calendars
 * Body: {
  "title": "一期稻作栽培曆",
  "zone_name":"紅色芭樂區",
  "cities":[1,2,3],
  "districts": [201,323]
 }
 */
router.post(
  "/crops/:cropId/calendars",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { cropId } = req.params;
    const { title, zone_name, districts = [], zone_ids = [] } = req.body;
    const role = req.user?.role;
    if (role !== "expert" && role !== "admin" && role !== "center") {
      return res.status(403).json({ status: "error", message: "沒有權限新增栽培曆" });
    }

    if (!title) {
      return res.status(400).json({ status: "error", message: "title 為必填" });
    }

    const crop = (await getCrops()).find((c) => c.id === cropId);
    if (!crop) {
      return res.status(404).json({ status: "error", message: "找不到該作物" });
    }

    const newCalendar = await createCalendar({
      cropId,
      title,
      creatorId: req.user.id,
      creatorName: "專家A",
      zoneName: zone_name,
      districtIds: districts,
      zoneIds: zone_ids,
    });

    res.status(201).json({
      status: "ok",
      message: "success",
      data: { id: newCalendar.id },
    });
  }),
);

/**
 * 編輯栽培曆（名稱 / 區域）
 * PATCH /api/crop-calendars/calendars/:calendarId
 * Body: { title, zone_name, cities, districts }
 */
router.patch(
  "/calendars/:calendarId",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { calendarId } = req.params;
    const { title, zone_name, districts } = req.body;

    try {
      const calendar = await requireCalendarEditPermission(req, res, calendarId);
      if (!calendar) return;
      const updated = await updateCalendar(calendarId, {
        title,
        zoneName: zone_name,
        districtIds: districts,
      });

      res.json({
        status: "ok",
        message: "success",
        data: { id: updated.id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ status: "error", message: "找不到該栽培曆" });
      }
      throw error;
    }
  }),
);

/**
 * 刪除栽培曆
 * DELETE /api/crop-calendars/calendars/:calendarId
 */
router.delete(
  "/calendars/:calendarId",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { calendarId } = req.params;

    try {
      const calendar = await requireCalendarEditPermission(req, res, calendarId);
      if (!calendar) return;
      await deleteCalendar(calendarId);
    } catch (error) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ status: "error", message: "找不到該栽培曆" });
      }
      throw error;
    }

    res.json({ status: "ok", message: "success" });
  }),
);

/**
 * 共享栽培曆（產生專家栽培曆範本）
 * POST /api/crop-calendars/calendars/:calendarId/share
 */
router.post(
  "/calendars/:calendarId/share",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { calendarId } = req.params;
    const role = req.user?.role;
    if (role !== "expert" && role !== "admin") {
      return res.status(403).json({ status: "error", message: "只有專家或管理員可以分享栽培曆" });
    }
    const calendar = await requireCalendarPermission(req, res, calendarId, "share");
    if (!calendar) return;

    try {
      const calendar = await shareCalendar(calendarId);
      res.json({ status: "ok", message: "success", data: { id: calendar.id } });
    } catch (error) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ status: "error", message: "找不到該栽培曆" });
      }
      throw error;
    }
  }),
);

/**
 * 複製栽培曆（產生專家栽培曆副本）
 * POST /api/crop-calendars/calendars/:calendarId/copy
 */
router.post(
  "/calendars/:calendarId/copy",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { calendarId } = req.params;
    const role = req.user?.role;
    if (role !== "expert" && role !== "admin" && role !== "center") {
      return res.status(403).json({ status: "error", message: "沒有權限複製栽培曆" });
    }

    const copied = await copyCalendar(calendarId, req.user.id, "專家A");
    if (!copied) {
      return res
        .status(404)
        .json({ status: "error", message: "找不到該栽培曆" });
    }

    res.status(201).json({
      status: "ok",
      message: "success",
      data: { id: copied.id },
    });
  }),
);

/**
 * 發布栽培曆（產生公開栽培曆）
 * POST /api/crop-calendars/calendars/:calendarId/publish
 */
router.post(
  "/calendars/:calendarId/publish",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { calendarId } = req.params;
    const role = req.user?.role;
    if (role !== "center" && role !== "admin") {
      return res.status(403).json({ status: "error", message: "只有中心人員或管理員可以發布栽培曆" });
    }
    if (role === "center") {
      const calendar = await getCalendarAccess(calendarId);
      if (!calendar) {
        return res.status(404).json({ status: "error", message: "找不到該栽培曆" });
      }
      if (!calendar.sourceCalendarId) {
        return res.status(403).json({ status: "error", message: "中心人員需先複製原稿後才能發布" });
      }
    }

    try {
      const calendar = await publishCalendar(calendarId, true);
      res.json({ status: "ok", message: "success", data: { id: calendar.id } });
    } catch (error) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ status: "error", message: "找不到該栽培曆" });
      }
      throw error;
    }
  }),
);

/**
 * 取消發布栽培曆
 * POST /api/crop-calendars/calendars/:calendarId/unpublish
 */
router.post(
  "/calendars/:calendarId/unpublish",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { calendarId } = req.params;

    try {
      const calendar = await publishCalendar(calendarId, false);
      res.json({ status: "ok", message: "success", data: { id: calendar.id } });
    } catch (error) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ status: "error", message: "找不到該栽培曆" });
      }
      throw error;
    }
  }),
);

// ============================================
// 四、生長期管理
// ============================================

/**
 * 生長期清單
 * GET /api/crop-calendars/crops/:cropId/calendars/:calendarId/stages
 */
router.get(
  "/crops/:cropId/calendars/:calendarId/stages",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { calendarId } = req.params;

    const calendarDetail = await getCalendarDetail(calendarId);
    if (!calendarDetail) {
      return res
        .status(404)
        .json({ status: "error", message: "找不到該栽培曆" });
    }

    if (
      !calendarDetail.is_published &&
      !calendarDetail.is_shared &&
      (!req.user || req.user.id !== calendarDetail.creator_id)
    ) {
      return res
        .status(401)
        .json({ status: "error", message: "未發布的栽培曆需要認證才能存取" });
    }

    const stageList = await getStageList(calendarId);
    res.json({ status: "ok", message: "success", data: stageList });
  }),
);

/**
 * 生長期詳細資料
 * GET /api/crop-calendars/crops/:cropId/calendars/:calendarId/stages/:stageId
 */
router.get(
  "/crops/:cropId/calendars/:calendarId/stages/:stageId",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { calendarId, stageId } = req.params;

    const calendarDetail = await getCalendarDetail(calendarId);
    if (!calendarDetail) {
      return res
        .status(404)
        .json({ status: "error", message: "找不到該栽培曆" });
    }

    if (
      !calendarDetail.is_published &&
      !calendarDetail.is_shared &&
      (!req.user || req.user.id !== calendarDetail.creator_id)
    ) {
      return res
        .status(401)
        .json({ status: "error", message: "未發布的栽培曆需要認證才能存取" });
    }

    const stage = await getStageDetail(calendarId, stageId);
    if (!stage) {
      return res
        .status(404)
        .json({ status: "error", message: "找不到該生長期" });
    }

    res.json({ status: "ok", message: "success", data: stage });
  }),
);

/**
 * 新增生長期
 * POST /api/crop-calendars/crops/:cropId/calendars/:calendarId/stages
 */
router.post(
  "/crops/:cropId/calendars/:calendarId/stages",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { cropId, calendarId } = req.params;
    const { name, stage_id } = req.body;
    const stageName = stage_id ?? name;

    if (!stageName) {
      return res
        .status(400)
        .json({ status: "error", message: "stage_id 為必填" });
    }

    const crop = (await getCrops()).find((c) => c.id === cropId);
    if (!crop) {
      return res.status(404).json({ status: "error", message: "找不到該作物" });
    }

    const calendarDetail = await getCalendarDetail(calendarId);
    if (!calendarDetail) {
      return res
        .status(404)
        .json({ status: "error", message: "找不到該栽培曆" });
    }

    const newStage = await createStage({
      calendarId,
      payload: { ...req.body, name: stageName },
    });

    res.status(201).json({
      status: "ok",
      message: "success",
      data: { id: newStage.id },
    });
  }),
);

/**
 * 編輯生長期
 * PUT /api/crop-calendars/crops/:cropId/calendars/:calendarId/stages/:stageId
 */
router.put(
  "/crops/:cropId/calendars/:calendarId/stages/:stageId",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { calendarId, stageId } = req.params;
    const payload =
      req.body.stage_id !== undefined && req.body.name === undefined
        ? { ...req.body, name: req.body.stage_id }
        : req.body;

    try {
      const updated = await updateStage({ calendarId, stageId, payload });
      res.json({ status: "ok", message: "success", data: { id: updated.id } });
    } catch (error) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ status: "error", message: "找不到該生長期" });
      }
      throw error;
    }
  }),
);

/**
 * 刪除生長期
 * DELETE /api/crop-calendars/crops/:cropId/calendars/:calendarId/stages/:stageId
 */
router.delete(
  "/crops/:cropId/calendars/:calendarId/stages/:stageId",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { calendarId, stageId } = req.params;

    try {
      await deleteStage(calendarId, stageId);
    } catch (error) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ status: "error", message: "找不到該生長期" });
      }
      throw error;
    }

    res.json({ status: "ok", message: "success" });
  }),
);

// ============================================
// 五、生長期圖片管理
// ============================================

/**
 * 新增生長期封面圖
 * POST /api/crop-calendars/stages/:stageId/cover
 */
router.post(
  "/stages/:stageId/cover",
  authMiddleware,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const { stageId } = req.params;
    const { source = "" } = req.body;

    const stage = await getStageDetail(stageId);
    if (!stage) {
      return res
        .status(404)
        .json({ status: "error", message: "找不到該生長期" });
    }

    const cover = await addStageCover({ stageId, source, file: req.file });

    res.status(201).json({
      status: "ok",
      message: "success",
      data: { id: cover.id },
    });
  }),
);

/**
 * 編輯生長期封面圖
 * PUT /api/crop-calendars/stages/:stageId/cover
 */
router.put(
  "/stages/:stageId/cover",
  authMiddleware,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const { stageId } = req.params;
    const { source, cover_image_id } = req.body;

    const updated = await updateStageCover({
      stageId,
      source,
      file: req.file,
      coverImageId: cover_image_id
    });
    if (!updated) {
      return res
        .status(400)
        .json({ status: "error", message: "尚未設定封面圖" });
    }

    res.json({
      status: "ok",
      message: "success",
      data: { id: updated.id },
    });
  }),
);

/**
 * 新增相簿圖片
 * POST /api/crop-calendars/stages/:stageId/album
 */
router.post(
  "/stages/:stageId/album",
  authMiddleware,
  upload.array("file", 10),
  asyncHandler(async (req, res) => {
    const { stageId } = req.params;
    const { source = "" } = req.body;

    const stage = await getStageDetail(stageId);
    if (!stage) {
      return res
        .status(404)
        .json({ status: "error", message: "找不到該生長期" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "請至少上傳一張圖片" });
    }

    let sortOrders = [];
    try {
      sortOrders = req.body.sort_order ? JSON.parse(req.body.sort_order) : [];
    } catch {
      sortOrders = [];
    }

    const newPhotos = await addStageAlbum({
      stageId,
      source,
      files: req.files,
      sortOrders,
    });

    res.status(201).json({
      status: "ok",
      message: "success",
      data: { ids: newPhotos.map((p) => p.id) },
    });
  }),
);

/**
 * 編輯相簿（最終狀態更新）
 * PUT /api/crop-calendars/stages/:stageId/album
 *
 * 參數說明：
 * - images: JSON 陣列，描述最終狀態
 *   - 有 id: 保留的現有圖片
 *   - 無 id: 新圖片（按順序對應 files）
 *   - sort_order: 最終排序
 * - source: 選填，套用到所有圖片
 * - files: 新圖片檔案
 */
router.put(
  "/stages/:stageId/album",
  authMiddleware,
  upload.array("files", 10),
  asyncHandler(async (req, res) => {
    const { stageId } = req.params;
    const { source } = req.body;

    let images = [];
    try {
      images = req.body.images ? JSON.parse(req.body.images) : [];
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "images 格式錯誤，必須是有效的 JSON 陣列",
      });
    }

    if (images.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "請提供 images 陣列",
      });
    }

    const result = await updateStageAlbum({
      stageId,
      images,
      source,
      files: req.files || [],
    });

    res.json({
      status: "ok",
      message: "success",
      data: {
        created: result.createdIds,
        updated: result.updatedIds,
        deleted: result.deletedIds,
      },
    });
  }),
);

// ============================================
// 六、指標管理
// ============================================

/**
 * 指標類別
 * GET /api/crop-calendars/crops/:cropId/indicator-categories
 */
router.get(
  "/crops/:cropId/indicator-categories",
  asyncHandler(async (req, res) => {
    const { cropId } = req.params;

    const crop = (await getCrops()).find((c) => c.id === cropId);
    if (!crop) {
      return res.status(404).json({ status: "error", message: "找不到該作物" });
    }

    const indicatorCategories = await getIndicatorCategories();
    res.json({ status: "ok", message: "success", data: indicatorCategories });
  }),
);

/**
 * 指標明細
 * GET /api/crop-calendars/crops/:cropId/indicators
 * Query: category_id
 */
router.get(
  "/crops/:cropId/indicators",
  asyncHandler(async (req, res) => {
    const { cropId } = req.params;
    const categoryId = req.query.categoryId || req.query.category_id;

    const crop = (await getCrops()).find((c) => c.id === cropId);
    if (!crop) {
      return res.status(404).json({ status: "error", message: "找不到該作物" });
    }

    const indicators = await getIndicators(categoryId);
    res.json({ status: "ok", message: "success", data: indicators });
  }),
);

module.exports = router;
