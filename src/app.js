const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const cropCalendarRoutes = require('./routes/cropCalendarRoutes');
const seedMockData = require('../prisma/seed');

const app = express();
const PORT = process.env.PORT || 3000;

// 中介軟體
app.use(cors());
app.use(express.json());

const shouldStringifyIdKey = (key) =>
  key === "id" || key.endsWith("_id") || key.endsWith("Id");

const shouldStringifyIdsArrayKey = (key) =>
  key === "ids" || key.endsWith("_ids") || key.endsWith("Ids");

const stringifyIds = (value, key = "") => {
  if (Array.isArray(value)) {
    if (key && shouldStringifyIdsArrayKey(key)) {
      return value.map((v) => (typeof v === "number" ? String(v) : stringifyIds(v)));
    }
    return value.map((v) => stringifyIds(v));
  }

  if (value && typeof value === "object") {
    const result = {};
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === "number" && shouldStringifyIdKey(k)) {
        result[k] = String(v);
      } else {
        result[k] = stringifyIds(v, k);
      }
    }
    return result;
  }

  return value;
};

app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => originalJson(stringifyIds(body));
  next();
});

// 路由（固定走 DB）
app.use('/api/crop-calendars', cropCalendarRoutes);

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '伺服器運行中' });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({ error: '找不到該路徑' });
});

// 錯誤處理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '伺服器內部錯誤' });
});

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("資料庫連線失敗:", error.message);
  }

  try {
    await seedMockData({ reset: false });
    console.log("Mock 資料已寫入資料庫");
  } catch (error) {
    console.error("Mock 資料寫入失敗:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`伺服器運行於 http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;
