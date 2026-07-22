const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");
const { validateBody } = require("../middlewares/validate");

const router = express.Router();

// Barcha task route'lari login qilingan foydalanuvchi uchun
router.use(protect);

router.post("/", validateBody(["projectId", "title"]), createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.patch("/:id/status", validateBody(["status"]), updateTaskStatus);
router.delete("/:id", deleteTask);

module.exports = router;
