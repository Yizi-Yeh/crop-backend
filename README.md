明白，我幫你把剛剛的完整流程整理成**純 Markdown 文件格式**，方便直接存成 `.md` 使用。下面是完整版本：

## 本機資料庫初始化（第一次或資料被清空時）
1. 建表
```bash
npx prisma db push
```
2. 塞入測試資料
```bash
npm run seed
```
3. 啟動
```bash
npm run dev
```

## 使用 migration（會建立 `prisma/migrations`）
```bash
npx prisma migrate dev --name init
npm run seed
npm run dev
```

````markdown
# 🌱 栽培曆 API 全流程文件

---

## 1️⃣ 作物管理

**取得作物清單**  
`GET /api/crop-calendars/crops`

```json
[
  { "id": "crop_001", "name": "水稻" },
  { "id": "crop_002", "name": "番茄" },
  { "id": "crop_003", "name": "高麗菜" },
  { "id": "crop_004", "name": "甜椒" },
  { "id": "crop_005", "name": "玉米" }
]
```
````

---

## 2️⃣ 栽培曆區域管理 (Zones)

**取得區域清單**
`GET /api/crop-calendars/crops/{crop_id}/zones`

```json
  {
    id: 201, // 區域 ID
    zone_name: "北區", // 區域名稱
    cities: [
      {
        id: 22, // 城市 ID
        name: "臺東縣", // 城市名稱
        districts: [
          // 該城市底下鄉鎮列表
          { id: 1076, name: "蘭嶼鄉" },
          { id: 1119, name: "綠島鄉" },
          { id: 1123, name: "卑南鄉" },
        ],
      },
      {
        id: 23,
        name: "花蓮縣",
        districts: [
          { id: 1082, name: "秀林鄉" },
          { id: 1083, name: "吉安鄉" },
        ],
      },
    ],
  },
```

**編輯區域清單**
`PATCH /api/crop-calendars/calendars/{calendar_id}`

```json
{
  "zones": [
    {
      "id": 201,
      "zone_name": "北區更新名稱",
      "district_ids": [1076, 1119, 1123, 1082, 1083]
    },
    {
      "id": 202,
      "zone_name": "中區",
      "district_ids": [3001, 3002]
    }
  ]
}
```

---

## 3️⃣ 栽培曆管理 (Calendars)

**清單**
`GET /api/crop-calendars/crops/{crop_id}/calendars?filter=owned|shared`

**新增栽培曆**
`POST /api/crop-calendars/calendars`

```json
{
  "title": "一期稻作栽培曆",
  "zone_ids": [201],
  "status": "draft"
}
```

**編輯名稱**
`PATCH /api/crop-calendars/calendars/{calendar_id}`

```json
{ "title": "一期稻作（更新後）" }
```

**刪除**
`DELETE /api/crop-calendars/calendars/{calendar_id}`

**共享 / 複製 / 發布**

- `POST /share` → 產生範本
- `POST /copy` → 產生副本
- `POST /publish` → 發布公開

**取得詳細資訊**
`GET /api/crop-calendars/crops/{crop_id}/calendars/{calendar_id}`

---

## 4️⃣ 生長期管理 (Stages)

**新增生長期**
`POST /api/crop-calendars/crops/{crop_id}/calendars/{calendar_id}/stages`

```json
{
  "name": "育苗期",
  "description": "播種至秧苗成長期",
  "start_date_ranges": { "month": 1, "name": "上旬" },
  "end_date_ranges": { "month": 2, "name": "上旬" },
  "color": "#4A90E2",
  "status": true,
  "thresholds": [
    { "indicator_id": "ind_001", "operator": ">", "value": 28, "unit": "°C" },
    { "indicator_id": "ind_005", "operator": ">=", "value": 3, "unit": "天" }
  ]
}
```

**編輯生長期**
`PUT /api/crop-calendars/crops/{crop_id}/calendars/{calendar_id}/stages/{stage_id}`

**刪除生長期**
`DELETE /api/crop-calendars/crops/{crop_id}/calendars/{calendar_id}/stages/{stage_id}`

---

## 5️⃣ 生長期圖片/相簿管理

**新增封面圖**
`POST /api/crop-calendars/stages/{stage_id}/cover`

**編輯封面圖**
`PUT /api/crop-calendars/stages/{stage_id}/cover`

**新增相簿**
`POST /api/crop-calendars/stages/{stage_id}/album`

**編輯相簿**
`POST /api/crop-calendars/stages/{stage_id}/album`

---

## 6️⃣ 指標管理 (Indicators)

`GET /api/crop-calendars/crops/{crop_id}/indicators?category_id=xxx`

```json
[
  { "id": "ind_001", "name": "最適生長溫度", "unit": "°C" },
  { "id": "ind_002", "name": "低溫警戒", "unit": "°C" },
  { "id": "ind_003", "name": "高溫警戒", "unit": "°C" },
  { "id": "ind_004", "name": "每日灌溉量", "unit": "mm" },
  { "id": "ind_005", "name": "連續降雨警戒", "unit": "天" }
]
```

---

## 7️⃣ 流程概念圖（文字版）

```
作物
 └─> 栽培曆
       ├─> 區域管理 (Zones)
       └─> 生長期 (Stages)
              ├─> 封面圖
              ├─> 相簿
              └─> 分析指標
```
