const express = require("express");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

// JSON body'larni parse qilish
app.use(express.json());

// Sog'lomlik tekshiruvi (health check)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Taskify API chotki ishlayapti!!",
  });
});

// Asosiy route'lar
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);

// 404 va xatoliklarni ushlash - har doim ENG OXIRIDA ulanadi
app.use(notFound);
app.use(errorHandler);

module.exports = app;
