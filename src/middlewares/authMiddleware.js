const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { readJSON } = require("../utils/fileHandler");
const { USERS_FILE } = require("../utils/dataPaths");

/**
 * Authorization: Bearer <token> headerini tekshiradi.
 * Token to'g'ri bo'lsa, req.user ga foydalanuvchi ma'lumotini yozadi (parolsiz).
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Avtorizatsiya talab qilinadi. Token yuborilmagan.");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Token yaroqsiz yoki muddati o'tgan.");
  }

  const users = await readJSON(USERS_FILE);
  const user = users.find((u) => u.id === decoded.id);

  if (!user) {
    throw new ApiError(401, "Bu tokenga tegishli foydalanuvchi topilmadi.");
  }

  // Parolni req.user ga qo'shmaymiz
  const { password, ...safeUser } = user;
  req.user = safeUser;

  next();
});

/**
 * Faqat "admin" role'iga ega foydalanuvchilarga ruxsat beradi.
 * Har doim `protect` dan keyin ishlatiladi.
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Bu amal uchun Admin huquqi talab qilinadi.");
  }
  next();
};

module.exports = { protect, isAdmin };
