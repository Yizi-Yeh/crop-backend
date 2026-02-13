const express = require("express");

const router = express.Router();

const {
  gwls,
  crops,
  zones,
  calendars,
  calendarDetails,
  stages,
  indicatorCategories,
  indicators,
  cities,
} = require("../data/mockData");

const ok = (res, data = null) =>
  res.json({ status: "ok", message: "success", data });

// Lists
router.get("/crops", (req, res) => ok(res, crops));
router.get("/gwls", (req, res) => ok(res, gwls));
router.get("/cities", (req, res) => ok(res, cities));

// Zones
router.get("/crops/:cropId/zones", (req, res) => {
  ok(res, zones);
});

// Calendars
router.get("/crops/:cropId/calendars", (req, res) => ok(res, calendars));
router.get("/crops/:cropId/calendars/:calendarId", (req, res) =>
  ok(
    res,
    calendarDetails.find((c) => c.id === req.params.calendarId) ||
      calendarDetails[0] ||
      {},
  ),
);
router.get("/calendars/:calendarId", (req, res) =>
  ok(
    res,
    calendarDetails.find((c) => c.id === req.params.calendarId) ||
      calendarDetails[0] ||
      {},
  ),
);

// Stages
router.get(
  "/crops/:cropId/calendars/:calendarId/stages",
  (req, res) => ok(res, stages),
);
router.get(
  "/crops/:cropId/calendars/:calendarId/stages/:stageId",
  (req, res) => ok(res, stages[0] || {}),
);

// Indicators
router.get("/crops/:cropId/indicator-categories", (req, res) =>
  ok(res, indicatorCategories),
);
router.get("/crops/:cropId/indicators", (req, res) =>
  ok(res, indicators),
);

// Generic handlers for mutating endpoints
router.post("*", (req, res) => ok(res, { id: "1" }));
router.put("*", (req, res) => ok(res, { id: "1" }));
router.patch("*", (req, res) => ok(res, { id: "1" }));
router.delete("*", (req, res) => ok(res));

// Fallback for any other GET
router.get("*", (req, res) => ok(res, {}));

module.exports = router;
