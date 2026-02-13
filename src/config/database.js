const prisma = require("../db/prisma");

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL 連線成功");
  } catch (error) {
    console.error("PostgreSQL 連線失敗:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
