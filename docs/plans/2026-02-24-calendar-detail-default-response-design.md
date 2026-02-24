# 栽培曆詳細固定回傳設計

## 背景與目標
將 `GET /api/crop-calendars/crops/:cropId/calendars/:calendarId` 的回傳改為固定 JSON，忽略所有參數與資料庫狀態。並移除 `indicators` 欄位。

## 需求摘要
- 任何請求皆回傳固定 `status: ok`、`message: success` 與固定 `data`。
- 不再回傳 404 或空陣列。
- 不依賴 `cropId`、`calendarId`、`city_id`、登入狀態、發布狀態。
- `data` 內容即使用者提供的固定 JSON，且不含 `indicators`。

## 方案與取捨
- 路由層直接回傳固定 JSON（採用）：改動最小且只影響單一路由。
- 服務層回傳固定 JSON：可能影響其他路由行為，不採用。
- mock 資料層覆蓋：改動分散，不採用。

## 架構與資料流
- 在 `cropCalendarRoutes` 的該路由 handler 內直接回傳固定 JSON。
- 既有的 `getCrops`、`getCalendarDetail`、權限與城市過濾流程不再執行。

## 錯誤處理
- 不回傳錯誤狀態或空結果，固定回傳成功結構。

## 測試
- 若專案已有路由測試，更新期望回傳。
- 若無測試，至少以手動呼叫確認結果一致。
