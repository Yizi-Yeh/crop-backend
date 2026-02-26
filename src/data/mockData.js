// 縣市清單鄉鎮
// GET /api/crop-calendars/cities
const cities = [
  {
    id: "1",
    name: "臺北市",
    districts: [
      { id: "101", name: "中正區" },
      { id: "102", name: "大同區" },
      { id: "103", name: "中山區" },
      { id: "104", name: "松山區" },
      { id: "105", name: "大安區" },
    ],
  },
  {
    id: "2",
    name: "新北市",
    districts: [
      { id: "201", name: "板橋區" },
      { id: "202", name: "三重區" },
      { id: "203", name: "中和區" },
      { id: "204", name: "永和區" },
      { id: "205", name: "新莊區" },
    ],
  },
  {
    id: "3",
    name: "桃園市",
    districts: [
      { id: "301", name: "桃園區" },
      { id: "302", name: "中壢區" },
      { id: "303", name: "大溪區" },
      { id: "304", name: "楊梅區" },
    ],
  },
  {
    id: "4",
    name: "臺中市",
    districts: [
      { id: "401", name: "中區" },
      { id: "402", name: "東區" },
      { id: "403", name: "西區" },
      { id: "404", name: "南區" },
      { id: "405", name: "北區" },
    ],
  },
  {
    id: "5",
    name: "臺南市",
    districts: [
      { id: "501", name: "中西區" },
      { id: "502", name: "東區" },
      { id: "503", name: "南區" },
      { id: "504", name: "北區" },
      { id: "505", name: "安平區" },
    ],
  },
  {
    id: "6",
    name: "高雄市",
    districts: [
      { id: "601", name: "楠梓區" },
      { id: "602", name: "左營區" },
      { id: "603", name: "鼓山區" },
      { id: "604", name: "三民區" },
      { id: "605", name: "前金區" },
    ],
  },
  {
    id: "22",
    name: "臺東縣",
    districts: [
      { id: "1076", name: "蘭嶼鄉" },
      { id: "1119", name: "綠島鄉" },
      { id: "1123", name: "卑南鄉" },
      { id: "1124", name: "臺東市" },
    ],
  },
  {
    id: "23",
    name: "花蓮縣",
    districts: [
      { id: "1082", name: "秀林鄉" },
      { id: "1083", name: "吉安鄉" },
      { id: "1084", name: "花蓮市" },
      { id: "1085", name: "壽豐鄉" },
    ],
  },
];

// 情境清單
// GET /api/crop-calendars/gwls
const gwls = [
  {
    id: "1",
    name: "GWL1.5(2020-2024)",
  },
  {
    id: "2",
    name: "GWL2",
  },
  {
    id: "3",
    name: "GWL4",
  },
];

// 作物清單
// GET /api/crop-calendars/crops
const crops = [
  { id: "crop_001", name: "芭樂" },
  { id: "crop_002", name: "番茄" },
  { id: "crop_003", name: "高麗菜" },
  { id: "crop_004", name: "甜椒" },
  { id: "crop_005", name: "玉米" },
];

// 栽培曆區域清單
// GET /api/crop-calendars/crops/{crop_id}/zones
const zones = [
  {
    id: "201", // 區域 ID
    calendar_id: "cal_001", // 栽培曆 ID
    zone_name: "紅色芭樂區", // 區域名稱
    cities: [
      {
        id: "22", // 城市 ID
        name: "臺東縣", // 城市名稱
        districts: [
          // 該城市底下鄉鎮列表
          { id: "1076", name: "蘭嶼鄉" },
          { id: "1119", name: "綠島鄉" },
          { id: "1123", name: "卑南鄉" },
        ],
      },
      {
        id: "23",
        name: "花蓮縣",
        districts: [
          { id: "1082", name: "秀林鄉" },
          { id: "1083", name: "吉安鄉" },
        ],
      },
      {
        id: "1",
        name: "臺北市",
        districts: [
          { id: "101", name: "中正區" },
          { id: "104", name: "松山區" },
          { id: "105", name: "大安區" },
        ],
      },
      {
        id: "2",
        name: "新北市",
        districts: [
          { id: "201", name: "板橋區" },
          { id: "203", name: "中和區" },
          { id: "205", name: "新莊區" },
        ],
      },
      {
        id: "4",
        name: "臺中市",
        districts: [
          { id: "401", name: "中區" },
          { id: "403", name: "西區" },
          { id: "405", name: "北區" },
        ],
      },
    ],
  },
  {
    id: "202",
    calendar_id: "cal_002",
    zone_name: "甜椒北部區",
    cities: [
      {
        id: "1",
        name: "臺北市",
        districts: [
          { id: "101", name: "中正區" },
          { id: "104", name: "松山區" },
        ],
      },
      {
        id: "2",
        name: "新北市",
        districts: [
          { id: "201", name: "板橋區" },
          { id: "203", name: "中和區" },
        ],
      },
    ],
  },
  {
    id: "203",
    calendar_id: "cal_003",
    zone_name: "甜椒中南部區",
    cities: [
      {
        id: "4",
        name: "臺中市",
        districts: [
          { id: "401", name: "中區" },
          { id: "405", name: "北區" },
        ],
      },
      {
        id: "6",
        name: "高雄市",
        districts: [
          { id: "601", name: "楠梓區" },
          { id: "604", name: "三民區" },
        ],
      },
    ],
  },
  {
    id: "204",
    calendar_id: "cal_004",
    zone_name: "玉米東部區",
    cities: [
      {
        id: "22",
        name: "臺東縣",
        districts: [
          { id: "1123", name: "卑南鄉" },
          { id: "1124", name: "臺東市" },
        ],
      },
      {
        id: "23",
        name: "花蓮縣",
        districts: [
          { id: "1082", name: "秀林鄉" },
          { id: "1084", name: "花蓮市" },
        ],
      },
    ],
  },
];

// 產生大量區域資料（用於壓測/列表展示）
const EXTRA_ZONE_COUNT = 60;
const buildZoneCities = (offset) => {
  const cityCount = 4 + (offset % 3); // 4-6 個城市
  const districtBaseCount = 2 + (offset % 3); // 2-4 個鄉鎮
  const output = [];

  for (let i = 0; i < cityCount; i += 1) {
    const city = cities[(offset + i) % cities.length];
    const districtCount = Math.min(
      city.districts.length,
      districtBaseCount + (i % 2),
    );

    output.push({
      id: city.id,
      name: city.name,
      districts: city.districts.slice(0, districtCount),
    });
  }

  return output;
};

const extraZones = [];
const extraCalendars = [];

for (let i = 0; i < EXTRA_ZONE_COUNT; i += 1) {
  const zoneId = String(300 + i);
  const calendarId = `cal_${String(100 + i).padStart(3, "0")}`;
  const zone = {
    id: zoneId,
    calendar_id: calendarId,
    zone_name: `擴充示範區域 ${i + 1}`,
    cities: buildZoneCities(i),
  };

  extraZones.push(zone);
  extraCalendars.push({
    id: calendarId,
    source_calendar_id: null,
    title: `擴充示範栽培曆 ${i + 1}`,
    creator: { id: "user_001", name: "專家A" },
    is_shared: false,
    is_published: false,
    file_type: "original",
    allow_center_use: true,
    published_at: "2025-06-11 12:00",
    updated_at: "2025-08-11 12:00",
    zone,
  });
}

zones.push(...extraZones);

const calendars = [
  {
    // 基本資訊
    id: "cal_001",
    source_calendar_id: "cal_001",
    title: "一期紅色芭樂培曆",

    // 建立者
    creator: {
      id: "user_001",
      name: "專家A",
    },

    permissions: {
      canCreate: true,
      canCopy: true,
      canEdit: false,
      canDelete: false,
    },

    // 栽培曆屬性
    is_shared: false, // 專家共享開關
    is_published: true, // 民眾公開開關
    file_type: "original", // original | copy
    allow_center_use: true,

    // 時間
    published_at: "2025-06-11 12:00",
    updated_at: "2025-08-11 12:00",

    zone: {
      id: "201",
      zone_name: "紅色芭樂區",
      cities: [
        {
          id: "22",
          name: "臺東縣",
          districts: [
            { id: "1076", name: "蘭嶼鄉" },
            { id: "1119", name: "綠島鄉" },
            { id: "1123", name: "卑南鄉" },
          ],
        },
        {
          id: "23",
          name: "花蓮縣",
          districts: [
            { id: "1082", name: "秀林鄉" },
            { id: "1083", name: "吉安鄉" },
          ],
        },
      ],
    },

    // 生長期清單
    stages: [
      {
        id: "stage_001",
        name: "接穗結果期",
        description:
          "接穗與砧木癒合完成後進入結果期，需維持穩定水分與通風，避免高溫造成落果。",
        start_date_range: {
          id: "start_stage_001",
          decade: "upper",
          month: "1",
        },
        end_date_range: { id: "end_stage_001", decade: "lower", month: "3" },
        status: "complete",
      },
      {
        id: "stage_002",
        name: "接穗結果期",
        description: "果實持續膨大，建議適度疏果並補充鉀肥以提升品質與糖度。",
        start_date_range: {
          id: "start_stage_002",
          decade: "middle",
          month: "2",
        },
        end_date_range: { id: "end_stage_002", decade: "middle", month: "4" },
        status: "complete",
      },
      {
        id: "stage_003",
        name: "果實成長期",
        description: "果實快速生長，注意水分均衡與病蟲害監測，避免裂果與日灼。",
        start_date_range: {
          id: "start_stage_003",
          decade: "lower",
          month: "3",
        },
        end_date_range: { id: "end_stage_003", decade: "lower", month: "6" },
        status: "complete",
      },
      {
        id: "stage_004",
        name: "果實成熟期",
        description:
          "成熟期需降低氮肥、提高通風，掌握採收時機以確保外觀與風味。",
        start_date_range: {
          id: "start_stage_004",
          decade: "upper",
          month: "5",
        },
        end_date_range: { id: "end_stage_004", decade: "lower", month: "9" },
        status: "complete",
      },
      {
        id: "stage_005",
        name: "砧木生育期",
        description:
          "砧木持續營養生長，重點在根系健全與枝條整齊，為後續嫁接做準備。",
        start_date_range: {
          id: "start_stage_005",
          decade: "middle",
          month: "10",
        },
        end_date_range: { id: "end_stage_005", decade: "lower", month: "12" },
        status: "complete",
      },
    ],

    // 指標（清單頁只需要名稱）
    indicators: [
      { id: "ind_001", name: "日均溫" },
      { id: "ind_002", name: "降雨量" },
    ],
  },
];

calendars.push(...extraCalendars);

// 栽培曆詳細
// GET /api/crop-calendars/crops/{crop_id}/calendars/{calendar_id}
// Query
// city_id → 1 篩選該城市的栽培曆 (TOC)
// gwl_id: 1 [GW1.5/GW2]
// source_id: 1 [推估資料/TRead]
const calendarDetails = [
  {
    id: "cal_001", // 栽培曆 ID
    title: "一期紅色芭樂培曆", // 栽培曆標題
    permissions: {
      canCreate: false,
      canCopy: true,
      canEdit: false,
      canDelete: false,
    },
    crop_name: "芭樂",
    updated_at: "2025-08-11 12:00",
    is_published: false, // 民眾公開開關
    is_shared: false, // 專家共享開關
    // 區域資訊
    zone: {
      id: "201",
      zone_name: "紅色芭樂區",
      cities: [
        {
          id: "22",
          name: "臺東縣",
          districts: [
            { id: "1076", name: "蘭嶼鄉" },
            { id: "1119", name: "綠島鄉" },
            { id: "1123", name: "卑南鄉" },
          ],
        },
        {
          id: "23",
          name: "花蓮縣",
          districts: [
            { id: "1082", name: "秀林鄉" },
            { id: "1083", name: "吉安鄉" },
          ],
        },
      ],
    },

    // 生長期清單
    stages: [
      {
        id: "stage_001",
        name: "接穗結果期",
        description:
          "接穗與砧木癒合完成後進入結果期，需維持穩定水分與通風，避免高溫造成落果。",
        cover_image: {
          id: "cover_stage_001",
          url: "https://picsum.photos/seed/cover-1/800/500",
          thumbnail: "https://picsum.photos/seed/cover-1/320/200",
          name: "接穗結果期封面.jpg",
          source: "農委會",
        },
        start_date_range: {
          id: "start_stage_001",
          decade: "upper",
          month: "1",
        },
        end_date_range: { id: "end_stage_001", decade: "lower", month: "3" },
        status: "complete",
        color: "#476dc6",
        album: [
          {
            id: "img_001",
            url: "https://picsum.photos/seed/stock-1/600/400",
            thumbnail: "https://picsum.photos/seed/stock-1/300/200",
            name: "接穗結果期示意圖01.jpg",
            source: "農委會",
            sort_order: 0,
          },
          {
            id: "img_002",
            url: "https://picsum.photos/seed/stock-2/600/400",
            thumbnail: "https://picsum.photos/seed/stock-2/300/200",
            name: "接穗結果期示意圖02.jpg",
            source: "農委會",
            sort_order: 1,
          },
          {
            id: "img_003",
            url: "https://picsum.photos/seed/stock-3/600/400",
            thumbnail: "https://picsum.photos/seed/stock-3/300/200",
            name: "接穗結果期示意圖03.jpg",
            source: "農委會",
            sort_order: 2,
          },
          {
            id: "img_004",
            url: "https://picsum.photos/seed/stock-4/600/400",
            thumbnail: "https://picsum.photos/seed/stock-4/300/200",
            name: "接穗結果期示意圖04.jpg",
            source: "農委會",
            sort_order: 3,
          },
          {
            id: "img_005",
            url: "https://picsum.photos/seed/stock-5/600/400",
            thumbnail: "https://picsum.photos/seed/stock-5/300/200",
            name: "接穗結果期示意圖05.jpg",
            source: "農委會",
            sort_order: 4,
          },
          {
            id: "img_006",
            url: "https://picsum.photos/seed/stock-6/600/400",
            thumbnail: "https://picsum.photos/seed/stock-6/300/200",
            name: "接穗結果期示意圖06.jpg",
            source: "農委會",
            sort_order: 5,
          },
          {
            id: "img_007",
            url: "https://picsum.photos/seed/stock-7/600/400",
            thumbnail: "https://picsum.photos/seed/stock-7/300/200",
            name: "接穗結果期示意圖07.jpg",
            source: "農委會",
            sort_order: 6,
          },
          {
            id: "img_008",
            url: "https://picsum.photos/seed/stock-8/600/400",
            thumbnail: "https://picsum.photos/seed/stock-8/300/200",
            name: "接穗結果期示意圖08.jpg",
            source: "農委會",
            sort_order: 7,
          },
          {
            id: "img_009",
            url: "https://picsum.photos/seed/stock-9/600/400",
            thumbnail: "https://picsum.photos/seed/stock-9/300/200",
            name: "接穗結果期示意圖09.jpg",
            source: "農委會",
            sort_order: 8,
          },
          {
            id: "img_010",
            url: "https://picsum.photos/seed/stock-10/600/400",
            thumbnail: "https://picsum.photos/seed/stock-10/300/200",
            name: "接穗結果期示意圖10.jpg",
            source: "農委會",
            sort_order: 9,
          },
        ],
      },
      {
        id: "stage_002",
        name: "接穗結果期",
        description: "果實持續膨大，建議適度疏果並補充鉀肥以提升品質與糖度。",
        cover_image: {
          id: "cover_stage_002",
          url: "https://picsum.photos/seed/cover-2/800/500",
          thumbnail: "https://picsum.photos/seed/cover-2/320/200",
          name: "果實膨大期封面.jpg",
          source: "農委會",
        },
        start_date_range: {
          id: "start_stage_002",
          decade: "middle",
          month: "2",
        },
        end_date_range: { id: "end_stage_002", decade: "middle", month: "4" },
        status: "complete",
        color: "#0AA7C6",
        album: [
          {
            id: "img_003",
            url: "https://picsum.photos/seed/stock-3/600/400",
            thumbnail: "https://picsum.photos/seed/stock-3/300/200",
            name: "接穗結果期示意圖03.jpg",
            source: "農委會",
            sort_order: 0,
          },
          {
            id: "img_004",
            url: "https://picsum.photos/seed/stock-4/600/400",
            thumbnail: "https://picsum.photos/seed/stock-4/300/200",
            name: "接穗結果期示意圖04.jpg",
            source: "農委會",
            sort_order: 1,
          },
          {
            id: "img_005",
            url: "https://picsum.photos/seed/stock-5/600/400",
            thumbnail: "https://picsum.photos/seed/stock-5/300/200",
            name: "接穗結果期示意圖05.jpg",
            source: "農委會",
            sort_order: 2,
          },
          {
            id: "img_006",
            url: "https://picsum.photos/seed/stock-6/600/400",
            thumbnail: "https://picsum.photos/seed/stock-6/300/200",
            name: "接穗結果期示意圖06.jpg",
            source: "農委會",
            sort_order: 3,
          },
          {
            id: "img_007",
            url: "https://picsum.photos/seed/stock-7/600/400",
            thumbnail: "https://picsum.photos/seed/stock-7/300/200",
            name: "接穗結果期示意圖07.jpg",
            source: "農委會",
            sort_order: 4,
          },
          {
            id: "img_008",
            url: "https://picsum.photos/seed/stock-8/600/400",
            thumbnail: "https://picsum.photos/seed/stock-8/300/200",
            name: "接穗結果期示意圖08.jpg",
            source: "農委會",
            sort_order: 5,
          },
          {
            id: "img_009",
            url: "https://picsum.photos/seed/stock-9/600/400",
            thumbnail: "https://picsum.photos/seed/stock-9/300/200",
            name: "接穗結果期示意圖09.jpg",
            source: "農委會",
            sort_order: 6,
          },
          {
            id: "img_010",
            url: "https://picsum.photos/seed/stock-10/600/400",
            thumbnail: "https://picsum.photos/seed/stock-10/300/200",
            name: "接穗結果期示意圖10.jpg",
            source: "農委會",
            sort_order: 7,
          },
          {
            id: "img_011",
            url: "https://picsum.photos/seed/stock-11/600/400",
            thumbnail: "https://picsum.photos/seed/stock-11/300/200",
            name: "接穗結果期示意圖11.jpg",
            source: "農委會",
            sort_order: 8,
          },
          {
            id: "img_012",
            url: "https://picsum.photos/seed/stock-12/600/400",
            thumbnail: "https://picsum.photos/seed/stock-12/300/200",
            name: "接穗結果期示意圖12.jpg",
            source: "農委會",
            sort_order: 9,
          },
        ],
      },
      {
        id: "stage_003",
        name: "果實成長期",
        description: "果實快速生長，注意水分均衡與病蟲害監測，避免裂果與日灼。",
        cover_image: {
          id: "cover_stage_003",
          url: "https://picsum.photos/seed/cover-3/800/500",
          thumbnail: "https://picsum.photos/seed/cover-3/320/200",
          name: "果實成長期封面.jpg",
          source: "農委會",
        },
        start_date_range: {
          id: "start_stage_003",
          decade: "lower",
          month: "3",
        },
        end_date_range: { id: "end_stage_003", decade: "lower", month: "6" },
        status: "complete",
        color: "#0AC675",
        album: [
          {
            id: "img_005",
            url: "https://picsum.photos/seed/grow-5/600/400",
            thumbnail: "https://picsum.photos/seed/grow-5/300/200",
            name: "果實成長期示意圖05.jpg",
            source: "農委會",
            sort_order: 0,
          },
          {
            id: "img_006",
            url: "https://picsum.photos/seed/grow-6/600/400",
            thumbnail: "https://picsum.photos/seed/grow-6/300/200",
            name: "果實成長期示意圖06.jpg",
            source: "農委會",
            sort_order: 1,
          },
          {
            id: "img_007",
            url: "https://picsum.photos/seed/grow-7/600/400",
            thumbnail: "https://picsum.photos/seed/grow-7/300/200",
            name: "果實成長期示意圖07.jpg",
            source: "農委會",
            sort_order: 2,
          },
          {
            id: "img_008",
            url: "https://picsum.photos/seed/grow-8/600/400",
            thumbnail: "https://picsum.photos/seed/grow-8/300/200",
            name: "果實成長期示意圖08.jpg",
            source: "農委會",
            sort_order: 3,
          },
          {
            id: "img_009",
            url: "https://picsum.photos/seed/grow-9/600/400",
            thumbnail: "https://picsum.photos/seed/grow-9/300/200",
            name: "果實成長期示意圖09.jpg",
            source: "農委會",
            sort_order: 4,
          },
          {
            id: "img_010",
            url: "https://picsum.photos/seed/grow-10/600/400",
            thumbnail: "https://picsum.photos/seed/grow-10/300/200",
            name: "果實成長期示意圖10.jpg",
            source: "農委會",
            sort_order: 5,
          },
          {
            id: "img_011",
            url: "https://picsum.photos/seed/grow-11/600/400",
            thumbnail: "https://picsum.photos/seed/grow-11/300/200",
            name: "果實成長期示意圖11.jpg",
            source: "農委會",
            sort_order: 6,
          },
          {
            id: "img_012",
            url: "https://picsum.photos/seed/grow-12/600/400",
            thumbnail: "https://picsum.photos/seed/grow-12/300/200",
            name: "果實成長期示意圖12.jpg",
            source: "農委會",
            sort_order: 7,
          },
          {
            id: "img_013",
            url: "https://picsum.photos/seed/grow-13/600/400",
            thumbnail: "https://picsum.photos/seed/grow-13/300/200",
            name: "果實成長期示意圖13.jpg",
            source: "農委會",
            sort_order: 8,
          },
          {
            id: "img_014",
            url: "https://picsum.photos/seed/grow-14/600/400",
            thumbnail: "https://picsum.photos/seed/grow-14/300/200",
            name: "果實成長期示意圖14.jpg",
            source: "農委會",
            sort_order: 9,
          },
        ],
      },
      {
        id: "stage_004",
        name: "果實成熟期",
        description:
          "成熟期需降低氮肥、提高通風，掌握採收時機以確保外觀與風味。",
        cover_image: {
          id: "cover_stage_004",
          url: "https://picsum.photos/seed/cover-4/800/500",
          thumbnail: "https://picsum.photos/seed/cover-4/320/200",
          name: "果實成熟期封面.jpg",
          source: "農委會",
        },
        start_date_range: {
          id: "start_stage_004",
          decade: "upper",
          month: "5",
        },
        end_date_range: { id: "end_stage_004", decade: "lower", month: "9" },
        status: "complete",
        color: "#C6B30A",
        album: [
          {
            id: "img_007",
            url: "https://picsum.photos/seed/fruit-7/600/400",
            thumbnail: "https://picsum.photos/seed/fruit-7/300/200",
            name: "果實成熟期示意圖07.jpg",
            source: "農委會",
            sort_order: 0,
          },
          {
            id: "img_008",
            url: "https://picsum.photos/seed/fruit-8/600/400",
            thumbnail: "https://picsum.photos/seed/fruit-8/300/200",
            name: "果實成熟期示意圖08.jpg",
            source: "農委會",
            sort_order: 1,
          },
          {
            id: "img_009",
            url: "https://picsum.photos/seed/fruit-9/600/400",
            thumbnail: "https://picsum.photos/seed/fruit-9/300/200",
            name: "果實成熟期示意圖09.jpg",
            source: "農委會",
            sort_order: 2,
          },
          {
            id: "img_010",
            url: "https://picsum.photos/seed/fruit-10/600/400",
            thumbnail: "https://picsum.photos/seed/fruit-10/300/200",
            name: "果實成熟期示意圖10.jpg",
            source: "農委會",
            sort_order: 3,
          },
          {
            id: "img_011",
            url: "https://picsum.photos/seed/fruit-11/600/400",
            thumbnail: "https://picsum.photos/seed/fruit-11/300/200",
            name: "果實成熟期示意圖11.jpg",
            source: "農委會",
            sort_order: 4,
          },
          {
            id: "img_012",
            url: "https://picsum.photos/seed/fruit-12/600/400",
            thumbnail: "https://picsum.photos/seed/fruit-12/300/200",
            name: "果實成熟期示意圖12.jpg",
            source: "農委會",
            sort_order: 5,
          },
          {
            id: "img_013",
            url: "https://picsum.photos/seed/fruit-13/600/400",
            thumbnail: "https://picsum.photos/seed/fruit-13/300/200",
            name: "果實成熟期示意圖13.jpg",
            source: "農委會",
            sort_order: 6,
          },
          {
            id: "img_014",
            url: "https://picsum.photos/seed/fruit-14/600/400",
            thumbnail: "https://picsum.photos/seed/fruit-14/300/200",
            name: "果實成熟期示意圖14.jpg",
            source: "農委會",
            sort_order: 7,
          },
          {
            id: "img_015",
            url: "https://picsum.photos/seed/fruit-15/600/400",
            thumbnail: "https://picsum.photos/seed/fruit-15/300/200",
            name: "果實成熟期示意圖15.jpg",
            source: "農委會",
            sort_order: 8,
          },
          {
            id: "img_016",
            url: "https://picsum.photos/seed/fruit-16/600/400",
            thumbnail: "https://picsum.photos/seed/fruit-16/300/200",
            name: "果實成熟期示意圖16.jpg",
            source: "農委會",
            sort_order: 9,
          },
        ],
      },
      {
        id: "stage_005",
        name: "砧木生育期",
        description:
          "砧木持續營養生長，重點在根系健全與枝條整齊，為後續嫁接做準備。",
        cover_image: {
          id: "cover_stage_005",
          url: "https://picsum.photos/seed/cover-5/800/500",
          thumbnail: "https://picsum.photos/seed/cover-5/320/200",
          name: "砧木生育期封面.jpg",
          source: "農委會",
        },
        start_date_range: {
          id: "start_stage_005",
          decade: "middle",
          month: "10",
        },
        end_date_range: { id: "end_stage_005", decade: "lower", month: "12" },
        status: "complete",
        color: "#C64C0A",
        album: [
          {
            id: "img_009",
            url: "https://picsum.photos/seed/root-9/600/400",
            thumbnail: "https://picsum.photos/seed/root-9/300/200",
            name: "砧木生育期示意圖09.jpg",
            source: "農委會",
            sort_order: 0,
          },
          {
            id: "img_010",
            url: "https://picsum.photos/seed/root-10/600/400",
            thumbnail: "https://picsum.photos/seed/root-10/300/200",
            name: "砧木生育期示意圖10.jpg",
            source: "農委會",
            sort_order: 1,
          },
          {
            id: "img_011",
            url: "https://picsum.photos/seed/root-11/600/400",
            thumbnail: "https://picsum.photos/seed/root-11/300/200",
            name: "砧木生育期示意圖11.jpg",
            source: "農委會",
            sort_order: 2,
          },
          {
            id: "img_012",
            url: "https://picsum.photos/seed/root-12/600/400",
            thumbnail: "https://picsum.photos/seed/root-12/300/200",
            name: "砧木生育期示意圖12.jpg",
            source: "農委會",
            sort_order: 3,
          },
          {
            id: "img_013",
            url: "https://picsum.photos/seed/root-13/600/400",
            thumbnail: "https://picsum.photos/seed/root-13/300/200",
            name: "砧木生育期示意圖13.jpg",
            source: "農委會",
            sort_order: 4,
          },
          {
            id: "img_014",
            url: "https://picsum.photos/seed/root-14/600/400",
            thumbnail: "https://picsum.photos/seed/root-14/300/200",
            name: "砧木生育期示意圖14.jpg",
            source: "農委會",
            sort_order: 5,
          },
          {
            id: "img_015",
            url: "https://picsum.photos/seed/root-15/600/400",
            thumbnail: "https://picsum.photos/seed/root-15/300/200",
            name: "砧木生育期示意圖15.jpg",
            source: "農委會",
            sort_order: 6,
          },
          {
            id: "img_016",
            url: "https://picsum.photos/seed/root-16/600/400",
            thumbnail: "https://picsum.photos/seed/root-16/300/200",
            name: "砧木生育期示意圖16.jpg",
            source: "農委會",
            sort_order: 7,
          },
          {
            id: "img_017",
            url: "https://picsum.photos/seed/root-17/600/400",
            thumbnail: "https://picsum.photos/seed/root-17/300/200",
            name: "砧木生育期示意圖17.jpg",
            source: "農委會",
            sort_order: 8,
          },
          {
            id: "img_018",
            url: "https://picsum.photos/seed/root-18/600/400",
            thumbnail: "https://picsum.photos/seed/root-18/300/200",
            name: "砧木生育期示意圖18.jpg",
            source: "農委會",
            sort_order: 9,
          },
        ],
      },
    ],

    // 分析數據

    analysis: {
      gwl: "GWL1.5(2020-2024)",
      indicators: [
        {
          id: "tmax_28",
          label: "日高溫 > 28°C",
          source: "動力",
          unit: "°C",
          current_threshold: "38",
          future_threshold: "38",
          monthly_data: [
            {
              month: "1",
              current_exceed_count: "2",
              future_exceed_count: "4",
              decade_data: [
                {
                  decade: "upper",
                  current_average: "26.4",
                  future_average: "27.7",
                },
                {
                  decade: "middle",
                  current_average: "26.4",
                  future_average: "27.7",
                },
                {
                  decade: "lower",
                  current_average: "26.4",
                  future_average: "27.7",
                },
              ],
            },
            {
              month: "2",
              current_exceed_count: "3",
              future_exceed_count: "5",
              decade_data: [
                {
                  decade: "upper",
                  current_average: "27.1",
                  future_average: "28.5",
                },
                {
                  decade: "middle",
                  current_average: "27.1",
                  future_average: "28.5",
                },
                {
                  decade: "lower",
                  current_average: "27.1",
                  future_average: "28.5",
                },
              ],
            },
            {
              month: "3",
              current_exceed_count: "4",
              future_exceed_count: "6",
              decade_data: [
                {
                  decade: "upper",
                  current_average: "28.4",
                  future_average: "29.8",
                },
                {
                  decade: "middle",
                  current_average: "28.4",
                  future_average: "29.8",
                },
                {
                  decade: "lower",
                  current_average: "28.4",
                  future_average: "29.8",
                },
              ],
            },
          ],
        },
        {
          id: "pr_10",
          label: "日降雨量 > 10mm",
          source: "統計",
          unit: "mm",
          current_threshold: "20",
          future_threshold: "20",
          monthly_data: [
            {
              month: "1",
              current_exceed_count: "4",
              future_exceed_count: "6",
              decade_data: [
                {
                  decade: "upper",
                  current_average: "12.3",
                  future_average: "14.1",
                },
                {
                  decade: "middle",
                  current_average: "11.8",
                  future_average: "13.6",
                },
                {
                  decade: "lower",
                  current_average: "10.9",
                  future_average: "12.7",
                },
              ],
            },
            {
              month: "2",
              current_exceed_count: "5",
              future_exceed_count: "7",
              decade_data: [
                {
                  decade: "upper",
                  current_average: "14.6",
                  future_average: "16.8",
                },
                {
                  decade: "middle",
                  current_average: "13.9",
                  future_average: "16.1",
                },
                {
                  decade: "lower",
                  current_average: "13.1",
                  future_average: "15.3",
                },
              ],
            },
            {
              month: "3",
              current_exceed_count: "7",
              future_exceed_count: "9",
              decade_data: [
                {
                  decade: "upper",
                  current_average: "18.2",
                  future_average: "21.4",
                },
                {
                  decade: "middle",
                  current_average: "17.5",
                  future_average: "20.6",
                },
                {
                  decade: "lower",
                  current_average: "16.8",
                  future_average: "19.9",
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

// 新增栽培曆 POST /api/crop-calendars/calendars/{calendar_id}
// 建立栽培曆主體（名稱、區域）
// {
//   "title": "一期稻作栽培曆",
//   "zone_name": "紅色芭樂區",
//   "cities": [1, 2, 3, 4, 5],
//   "districts": [201, 202, 203],
// }

// 刪除栽培曆 DELETE /api/crop-calendars/calendars/{calendar_id}

// 共享栽培曆	POST /api/crop-calendars/calendars/{calendar_id}/share	  產生專家栽培曆範本

// 複製栽培曆	POST /api/crop-calendars/calendars/{calendar_id}/copy     產生專家栽培曆副本

// 發布栽培曆	POST /api/crop-calendars/calendars/{calendar_id}/publish	產生公開栽培曆

// 生長期詳細資料（包含作物資訊圖片）
// GET /api/crop-calendars/crops/{crop_id}/calendars/{calendar_id}/stages/{stage_id}`
const stages = [
  {
    id: "stage_001",
    name: "接穗結果期",
    description:
      "接穗與砧木癒合完成後進入結果期，需維持穩定水分與通風，避免高溫造成落果。",
    cover_image: {
      id: "cover_stage_001",
      url: "https://picsum.photos/seed/cover-1/800/500",
      thumbnail: "https://picsum.photos/seed/cover-1/320/200",
      name: "接穗結果期封面.jpg",
      source: "農委會",
    },
    start_date_range: { id: "start_stage_001", decade: "upper", month: "1" },
    end_date_range: { id: "end_stage_001", decade: "lower", month: "3" },
    status: "complete",
    color: "#FDBA74",
    album: [
      {
        id: "img_001",
        url: "https://picsum.photos/seed/stock-1/600/400",
        thumbnail: "https://picsum.photos/seed/stock-1/300/200",
        name: "接穗結果期示意圖01.jpg",
        source: "農委會",
        sort_order: 0,
      },
      {
        id: "img_002",
        url: "https://picsum.photos/seed/stock-2/600/400",
        thumbnail: "https://picsum.photos/seed/stock-2/300/200",
        name: "接穗結果期示意圖02.jpg",
        source: "農委會",
        sort_order: 1,
      },
      {
        id: "img_003",
        url: "https://picsum.photos/seed/stock-3/600/400",
        thumbnail: "https://picsum.photos/seed/stock-3/300/200",
        name: "接穗結果期示意圖03.jpg",
        source: "農委會",
        sort_order: 2,
      },
      {
        id: "img_004",
        url: "https://picsum.photos/seed/stock-4/600/400",
        thumbnail: "https://picsum.photos/seed/stock-4/300/200",
        name: "接穗結果期示意圖04.jpg",
        source: "農委會",
        sort_order: 3,
      },
      {
        id: "img_005",
        url: "https://picsum.photos/seed/stock-5/600/400",
        thumbnail: "https://picsum.photos/seed/stock-5/300/200",
        name: "接穗結果期示意圖05.jpg",
        source: "農委會",
        sort_order: 4,
      },
      {
        id: "img_006",
        url: "https://picsum.photos/seed/stock-6/600/400",
        thumbnail: "https://picsum.photos/seed/stock-6/300/200",
        name: "接穗結果期示意圖06.jpg",
        source: "農委會",
        sort_order: 5,
      },
      {
        id: "img_007",
        url: "https://picsum.photos/seed/stock-7/600/400",
        thumbnail: "https://picsum.photos/seed/stock-7/300/200",
        name: "接穗結果期示意圖07.jpg",
        source: "農委會",
        sort_order: 6,
      },
      {
        id: "img_008",
        url: "https://picsum.photos/seed/stock-8/600/400",
        thumbnail: "https://picsum.photos/seed/stock-8/300/200",
        name: "接穗結果期示意圖08.jpg",
        source: "農委會",
        sort_order: 7,
      },
      {
        id: "img_009",
        url: "https://picsum.photos/seed/stock-9/600/400",
        thumbnail: "https://picsum.photos/seed/stock-9/300/200",
        name: "接穗結果期示意圖09.jpg",
        source: "農委會",
        sort_order: 8,
      },
      {
        id: "img_010",
        url: "https://picsum.photos/seed/stock-10/600/400",
        thumbnail: "https://picsum.photos/seed/stock-10/300/200",
        name: "接穗結果期示意圖10.jpg",
        source: "農委會",
        sort_order: 9,
      },
    ],
  },
  {
    id: "stage_002",
    name: "接穗結果期",
    description: "果實持續膨大，建議適度疏果並補充鉀肥以提升品質與糖度。",
    cover_image: {
      id: "cover_stage_002",
      url: "https://picsum.photos/seed/cover-2/800/500",
      thumbnail: "https://picsum.photos/seed/cover-2/320/200",
      name: "果實膨大期封面.jpg",
      source: "農委會",
    },
    start_date_range: { id: "start_stage_002", decade: "middle", month: "2" },
    end_date_range: { id: "end_stage_002", decade: "middle", month: "4" },
    status: "complete",
    color: "#FCD34D",
    album: [
      {
        id: "img_003",
        url: "https://picsum.photos/seed/stock-3/600/400",
        thumbnail: "https://picsum.photos/seed/stock-3/300/200",
        name: "接穗結果期示意圖03.jpg",
        source: "農委會",
        sort_order: 0,
      },
      {
        id: "img_004",
        url: "https://picsum.photos/seed/stock-4/600/400",
        thumbnail: "https://picsum.photos/seed/stock-4/300/200",
        name: "接穗結果期示意圖04.jpg",
        source: "農委會",
        sort_order: 1,
      },
      {
        id: "img_005",
        url: "https://picsum.photos/seed/stock-5/600/400",
        thumbnail: "https://picsum.photos/seed/stock-5/300/200",
        name: "接穗結果期示意圖05.jpg",
        source: "農委會",
        sort_order: 2,
      },
      {
        id: "img_006",
        url: "https://picsum.photos/seed/stock-6/600/400",
        thumbnail: "https://picsum.photos/seed/stock-6/300/200",
        name: "接穗結果期示意圖06.jpg",
        source: "農委會",
        sort_order: 3,
      },
      {
        id: "img_007",
        url: "https://picsum.photos/seed/stock-7/600/400",
        thumbnail: "https://picsum.photos/seed/stock-7/300/200",
        name: "接穗結果期示意圖07.jpg",
        source: "農委會",
        sort_order: 4,
      },
      {
        id: "img_008",
        url: "https://picsum.photos/seed/stock-8/600/400",
        thumbnail: "https://picsum.photos/seed/stock-8/300/200",
        name: "接穗結果期示意圖08.jpg",
        source: "農委會",
        sort_order: 5,
      },
      {
        id: "img_009",
        url: "https://picsum.photos/seed/stock-9/600/400",
        thumbnail: "https://picsum.photos/seed/stock-9/300/200",
        name: "接穗結果期示意圖09.jpg",
        source: "農委會",
        sort_order: 6,
      },
      {
        id: "img_010",
        url: "https://picsum.photos/seed/stock-10/600/400",
        thumbnail: "https://picsum.photos/seed/stock-10/300/200",
        name: "接穗結果期示意圖10.jpg",
        source: "農委會",
        sort_order: 7,
      },
      {
        id: "img_011",
        url: "https://picsum.photos/seed/stock-11/600/400",
        thumbnail: "https://picsum.photos/seed/stock-11/300/200",
        name: "接穗結果期示意圖11.jpg",
        source: "農委會",
        sort_order: 8,
      },
      {
        id: "img_012",
        url: "https://picsum.photos/seed/stock-12/600/400",
        thumbnail: "https://picsum.photos/seed/stock-12/300/200",
        name: "接穗結果期示意圖12.jpg",
        source: "農委會",
        sort_order: 9,
      },
    ],
  },
  {
    id: "stage_003",
    name: "果實成長期",
    description: "果實快速生長，注意水分均衡與病蟲害監測，避免裂果與日灼。",
    cover_image: {
      id: "cover_stage_003",
      url: "https://picsum.photos/seed/cover-3/800/500",
      thumbnail: "https://picsum.photos/seed/cover-3/320/200",
      name: "果實成長期封面.jpg",
      source: "農委會",
    },
    start_date_range: { id: "start_stage_003", decade: "lower", month: "3" },
    end_date_range: { id: "end_stage_003", decade: "lower", month: "6" },
    status: "complete",
    color: "#FDE68A",
    album: [
      {
        id: "img_005",
        url: "https://picsum.photos/seed/grow-5/600/400",
        thumbnail: "https://picsum.photos/seed/grow-5/300/200",
        name: "果實成長期示意圖05.jpg",
        source: "農委會",
        sort_order: 0,
      },
      {
        id: "img_006",
        url: "https://picsum.photos/seed/grow-6/600/400",
        thumbnail: "https://picsum.photos/seed/grow-6/300/200",
        name: "果實成長期示意圖06.jpg",
        source: "農委會",
        sort_order: 1,
      },
      {
        id: "img_007",
        url: "https://picsum.photos/seed/grow-7/600/400",
        thumbnail: "https://picsum.photos/seed/grow-7/300/200",
        name: "果實成長期示意圖07.jpg",
        source: "農委會",
        sort_order: 2,
      },
      {
        id: "img_008",
        url: "https://picsum.photos/seed/grow-8/600/400",
        thumbnail: "https://picsum.photos/seed/grow-8/300/200",
        name: "果實成長期示意圖08.jpg",
        source: "農委會",
        sort_order: 3,
      },
      {
        id: "img_009",
        url: "https://picsum.photos/seed/grow-9/600/400",
        thumbnail: "https://picsum.photos/seed/grow-9/300/200",
        name: "果實成長期示意圖09.jpg",
        source: "農委會",
        sort_order: 4,
      },
      {
        id: "img_010",
        url: "https://picsum.photos/seed/grow-10/600/400",
        thumbnail: "https://picsum.photos/seed/grow-10/300/200",
        name: "果實成長期示意圖10.jpg",
        source: "農委會",
        sort_order: 5,
      },
      {
        id: "img_011",
        url: "https://picsum.photos/seed/grow-11/600/400",
        thumbnail: "https://picsum.photos/seed/grow-11/300/200",
        name: "果實成長期示意圖11.jpg",
        source: "農委會",
        sort_order: 6,
      },
      {
        id: "img_012",
        url: "https://picsum.photos/seed/grow-12/600/400",
        thumbnail: "https://picsum.photos/seed/grow-12/300/200",
        name: "果實成長期示意圖12.jpg",
        source: "農委會",
        sort_order: 7,
      },
      {
        id: "img_013",
        url: "https://picsum.photos/seed/grow-13/600/400",
        thumbnail: "https://picsum.photos/seed/grow-13/300/200",
        name: "果實成長期示意圖13.jpg",
        source: "農委會",
        sort_order: 8,
      },
      {
        id: "img_014",
        url: "https://picsum.photos/seed/grow-14/600/400",
        thumbnail: "https://picsum.photos/seed/grow-14/300/200",
        name: "果實成長期示意圖14.jpg",
        source: "農委會",
        sort_order: 9,
      },
    ],
  },
  {
    id: "stage_004",
    name: "果實成熟期",
    description: "成熟期需降低氮肥、提高通風，掌握採收時機以確保外觀與風味。",
    cover_image: {
      id: "cover_stage_004",
      url: "https://picsum.photos/seed/cover-4/800/500",
      thumbnail: "https://picsum.photos/seed/cover-4/320/200",
      name: "果實成熟期封面.jpg",
      source: "農委會",
    },
    start_date_range: { id: "start_stage_004", decade: "upper", month: "5" },
    end_date_range: { id: "end_stage_004", decade: "lower", month: "9" },
    status: "complete",
    color: "#FCA5A5",
    album: [
      {
        id: "img_007",
        url: "https://picsum.photos/seed/fruit-7/600/400",
        thumbnail: "https://picsum.photos/seed/fruit-7/300/200",
        name: "果實成熟期示意圖07.jpg",
        source: "農委會",
        sort_order: 0,
      },
      {
        id: "img_008",
        url: "https://picsum.photos/seed/fruit-8/600/400",
        thumbnail: "https://picsum.photos/seed/fruit-8/300/200",
        name: "果實成熟期示意圖08.jpg",
        source: "農委會",
        sort_order: 1,
      },
      {
        id: "img_009",
        url: "https://picsum.photos/seed/fruit-9/600/400",
        thumbnail: "https://picsum.photos/seed/fruit-9/300/200",
        name: "果實成熟期示意圖09.jpg",
        source: "農委會",
        sort_order: 2,
      },
      {
        id: "img_010",
        url: "https://picsum.photos/seed/fruit-10/600/400",
        thumbnail: "https://picsum.photos/seed/fruit-10/300/200",
        name: "果實成熟期示意圖10.jpg",
        source: "農委會",
        sort_order: 3,
      },
      {
        id: "img_011",
        url: "https://picsum.photos/seed/fruit-11/600/400",
        thumbnail: "https://picsum.photos/seed/fruit-11/300/200",
        name: "果實成熟期示意圖11.jpg",
        source: "農委會",
        sort_order: 4,
      },
      {
        id: "img_012",
        url: "https://picsum.photos/seed/fruit-12/600/400",
        thumbnail: "https://picsum.photos/seed/fruit-12/300/200",
        name: "果實成熟期示意圖12.jpg",
        source: "農委會",
        sort_order: 5,
      },
      {
        id: "img_013",
        url: "https://picsum.photos/seed/fruit-13/600/400",
        thumbnail: "https://picsum.photos/seed/fruit-13/300/200",
        name: "果實成熟期示意圖13.jpg",
        source: "農委會",
        sort_order: 6,
      },
      {
        id: "img_014",
        url: "https://picsum.photos/seed/fruit-14/600/400",
        thumbnail: "https://picsum.photos/seed/fruit-14/300/200",
        name: "果實成熟期示意圖14.jpg",
        source: "農委會",
        sort_order: 7,
      },
      {
        id: "img_015",
        url: "https://picsum.photos/seed/fruit-15/600/400",
        thumbnail: "https://picsum.photos/seed/fruit-15/300/200",
        name: "果實成熟期示意圖15.jpg",
        source: "農委會",
        sort_order: 8,
      },
      {
        id: "img_016",
        url: "https://picsum.photos/seed/fruit-16/600/400",
        thumbnail: "https://picsum.photos/seed/fruit-16/300/200",
        name: "果實成熟期示意圖16.jpg",
        source: "農委會",
        sort_order: 9,
      },
    ],
  },
  {
    id: "stage_005",
    name: "砧木生育期",
    description:
      "砧木持續營養生長，重點在根系健全與枝條整齊，為後續嫁接做準備。",
    cover_image: {
      id: "cover_stage_005",
      url: "https://picsum.photos/seed/cover-5/800/500",
      thumbnail: "https://picsum.photos/seed/cover-5/320/200",
      name: "砧木生育期封面.jpg",
      source: "農委會",
    },
    start_date_range: { id: "start_stage_005", decade: "middle", month: "10" },
    end_date_range: { id: "end_stage_005", decade: "lower", month: "12" },
    status: "complete",
    color: "#FED7AA",
    album: [
      {
        id: "img_009",
        url: "https://picsum.photos/seed/root-9/600/400",
        thumbnail: "https://picsum.photos/seed/root-9/300/200",
        name: "砧木生育期示意圖09.jpg",
        source: "農委會",
        sort_order: 0,
      },
      {
        id: "img_010",
        url: "https://picsum.photos/seed/root-10/600/400",
        thumbnail: "https://picsum.photos/seed/root-10/300/200",
        name: "砧木生育期示意圖10.jpg",
        source: "農委會",
        sort_order: 1,
      },
      {
        id: "img_011",
        url: "https://picsum.photos/seed/root-11/600/400",
        thumbnail: "https://picsum.photos/seed/root-11/300/200",
        name: "砧木生育期示意圖11.jpg",
        source: "農委會",
        sort_order: 2,
      },
      {
        id: "img_012",
        url: "https://picsum.photos/seed/root-12/600/400",
        thumbnail: "https://picsum.photos/seed/root-12/300/200",
        name: "砧木生育期示意圖12.jpg",
        source: "農委會",
        sort_order: 3,
      },
      {
        id: "img_013",
        url: "https://picsum.photos/seed/root-13/600/400",
        thumbnail: "https://picsum.photos/seed/root-13/300/200",
        name: "砧木生育期示意圖13.jpg",
        source: "農委會",
        sort_order: 4,
      },
      {
        id: "img_014",
        url: "https://picsum.photos/seed/root-14/600/400",
        thumbnail: "https://picsum.photos/seed/root-14/300/200",
        name: "砧木生育期示意圖14.jpg",
        source: "農委會",
        sort_order: 5,
      },
      {
        id: "img_015",
        url: "https://picsum.photos/seed/root-15/600/400",
        thumbnail: "https://picsum.photos/seed/root-15/300/200",
        name: "砧木生育期示意圖15.jpg",
        source: "農委會",
        sort_order: 6,
      },
      {
        id: "img_016",
        url: "https://picsum.photos/seed/root-16/600/400",
        thumbnail: "https://picsum.photos/seed/root-16/300/200",
        name: "砧木生育期示意圖16.jpg",
        source: "農委會",
        sort_order: 7,
      },
      {
        id: "img_017",
        url: "https://picsum.photos/seed/root-17/600/400",
        thumbnail: "https://picsum.photos/seed/root-17/300/200",
        name: "砧木生育期示意圖17.jpg",
        source: "農委會",
        sort_order: 8,
      },
      {
        id: "img_018",
        url: "https://picsum.photos/seed/root-18/600/400",
        thumbnail: "https://picsum.photos/seed/root-18/300/200",
        name: "砧木生育期示意圖18.jpg",
        source: "農委會",
        sort_order: 9,
      },
    ],
  },
];

// 新增生長期 POST /api/crop-calendars/crops/{crop_id}/calendars/{calendar_id}/stages/{stage_id}
// {
//      "name": "育苗期",
//     "description": "播種至秧苗成長期",
//     "start_date_range": { "month": 1, "decade": "upper" },
//     "end_date_range": { "month": 2, "decade": "upper" },
//     "color": "#4A90E2",
//     "status": "draft",   // draft | complete
//     "thresholds": [
//       {
//         "indicator_id": "ind_001",  // 指標 ID (如：日平均氣溫)
//         "operator": ">",          // 比較符號
//         "value": 28,              // 門檻數值
//         "duration_days": 1        // 連續天數
//       },
//       {
//         "indicator_id": "ind_005",  // 指標 ID (如：連續降雨)
//         "operator": ">=",
//         "value": 3,
//         "duration_days": 3
//       }
//     ]
// }

// 編輯生長期 PUT /api/crop-calendars/crops/{crop_id}/calendars/{calendar_id}/stages/{stage_id}
// {
//   "name": "育苗期",
//   "description": "播種至秧苗成長期",
//   "start_date_range": { "month": 1, "decade": "upper" },
//   "end_date_range": { "month": 2, "decade": "upper" },
//   "color": "#4A90E2",
//   "status": "draft",   // draft | complete
//   "thresholds": [
//     {
//       "indicator_id": "ind_001", // 指標 ID (如：日平均氣溫)
//       "operator": ">",           // 比較符號 (>, <, >=, <=)
//       "value": 28,               // 門檻數值
//       "unit": "°C",              // 單位 (選填，通常後端可由 ID 帶出)
//       "duration_days": 1         // 連續天數
//     },
//     {
//       "indicator_id": "ind_005", // 指標 ID (如：連續降雨)
//       "operator": ">=",
//       "value": 3,
//       "unit": "天",
//       "duration_days": 3
//     }
//   ]
// }

// 刪除生長期 DELETE /api/crop-calendars/crops/{crop_id}/calendars/{calendar_id}/stages/{stage_id}

// 新增生長期封面圖 POST /api/crop-calendars/stages/{stage_id}/cover

// 編輯生長期封面圖 PUT /api/crop-calendars/stages/{stage_id}/cover

// 新增生長期相簿 POST /api/crop-calendars/stages/{stage_id}/album

// 編輯生長期相簿 PUT /api/crop-calendars/stages/{stage_id}/album

// 指標類別
// GET /api/crop-calendars/crops/{crop_id}/indicator-categories
const indicatorCategories = [
  { id: "cat_001", name: "氣溫" },
  { id: "cat_002", name: "雨量" },
  { id: "cat_003", name: "日照" },
];

// 指標明細
// GET /api/crop-calendars/crops/{crop_id}/indicators
// Query: category_id
const indicators = [
  {
    id: "ind_001",
    name: "日均溫",
    unit: "°C",
  },
  {
    id: "ind_002",
    name: "日高溫",
    unit: "°C",
  },
  {
    id: "ind_003",
    name: "日低溫",
    unit: "°C",
  },
  {
    id: "ind_004",
    name: "日雨量",
    unit: "mm",
  },
  {
    id: "ind_005",
    name: "連續降雨天數",
    unit: "天",
  },
  {
    id: "ind_006",
    name: "日照時數",
    unit: "小時",
  },
];

// ID 生成器
const generateId = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

module.exports = {
  gwls,
  crops,
  zones,
  calendars,
  calendarDetails,
  stages,
  indicatorCategories,
  indicators,
  cities,
  generateId,
};
