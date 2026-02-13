/**
 * Bearer Token 認證中介軟體
 * 驗證請求標頭中的 Authorization Bearer Token
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: '缺少認證標頭' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: '認證格式錯誤，請使用 Bearer Token' });
  }

  const token = parts[1];

  // 簡易 Token 驗證（實際專案應使用 JWT 或其他驗證機制）
  if (!token || token.length < 10) {
    return res.status(401).json({ error: '無效的 Token' });
  }

  // 將使用者資訊附加到請求物件（模擬解碼後的資訊）
  req.user = {
    id: 'user_001',
    role: 'expert',
    token,
  };

  next();
};

/**
 * 可選認證中介軟體
 * 有帶 Authorization header → 驗證 token，失敗回 401
 * 沒帶 Authorization header → 不設 req.user，直接放行
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: '認證格式錯誤，請使用 Bearer Token' });
  }

  const token = parts[1];

  if (!token || token.length < 10) {
    return res.status(401).json({ error: '無效的 Token' });
  }

  req.user = {
    id: 'user_001',
    role: 'expert',
    token,
  };

  next();
};

module.exports = authMiddleware;
module.exports.optionalAuth = optionalAuth;
