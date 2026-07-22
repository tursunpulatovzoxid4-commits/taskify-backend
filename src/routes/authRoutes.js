const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { validateBody, validateEmail } = require("../middlewares/validate");

const router = express.Router();

router.post(
  "/register",
  validateBody(["name", "email", "password"]),
  validateEmail,
  register
);

router.post(
  "/login",
  validateBody(["email", "password"]),
  validateEmail,
  login
);

router.get("/me", protect, getMe);

module.exports = router;
