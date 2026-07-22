const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");
const { validateBody } = require("../middlewares/validate");

const router = express.Router();

// Barcha project route'lari login qilingan foydalanuvchi uchun
router.use(protect);

router.post("/", validateBody(["title"]), createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProject);

module.exports = router;
