const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { readJSON, writeJSON } = require("../utils/fileHandler");
const { USERS_FILE } = require("../utils/dataPaths");

/**
 * Foydalanuvchi uchun JWT token generatsiya qiladi.
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /api/v1/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const users = await readJSON(USERS_FILE);

  const emailExists = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (emailExists) {
    throw new ApiError(409, "Bu email bilan foydalanuvchi allaqachon ro'yxatdan o'tgan.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role: role === "admin" ? "admin" : "user", // xavfsizlik uchun default "user"
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeJSON(USERS_FILE, users);

  const token = generateToken(newUser);
  const { password: _pw, ...safeUser } = newUser;

  res.status(201).json({
    success: true,
    message: "Ro'yxatdan muvaffaqiyatli o'tdingiz.",
    data: { user: safeUser, token },
  });
});

// POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const users = await readJSON(USERS_FILE);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new ApiError(401, "Email yoki parol noto'g'ri.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Email yoki parol noto'g'ri.");
  }

  const token = generateToken(user);
  const { password: _pw, ...safeUser } = user;

  res.status(200).json({
    success: true,
    message: "Tizimga muvaffaqiyatli kirdingiz.",
    data: { user: safeUser, token },
  });
});

// GET /api/v1/auth/me  (protect middleware'dan keyin ishlaydi)
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
});

module.exports = { register, login, getMe };
