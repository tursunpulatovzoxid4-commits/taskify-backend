const path = require("path");

// Barcha JSON fayllarga yo'llarni bitta joyda saqlash - kelajakda o'zgartirish oson bo'ladi
const DATA_DIR = path.join(__dirname, "..", "..", "data");

module.exports = {
  USERS_FILE: path.join(DATA_DIR, "users.json"),
  PROJECTS_FILE: path.join(DATA_DIR, "projects.json"),
  TASKS_FILE: path.join(DATA_DIR, "tasks.json"),
};
