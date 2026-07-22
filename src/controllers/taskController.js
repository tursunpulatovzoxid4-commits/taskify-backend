const { v4: uuidv4 } = require("uuid");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { readJSON, writeJSON } = require("../utils/fileHandler");
const { TASKS_FILE } = require("../utils/dataPaths");

const VALID_STATUSES = ["todo", "in-progress", "done"];

// POST /api/v1/tasks
const createTask = asyncHandler(async (req, res) => {
  const { projectId, title, status, assignedTo } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `status faqat quyidagilardan biri bo'lishi mumkin: ${VALID_STATUSES.join(", ")}`);
  }

  const tasks = await readJSON(TASKS_FILE);

  const newTask = {
    id: uuidv4(),
    projectId,
    title,
    status: status || "todo",
    assignedTo: assignedTo || null,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  await writeJSON(TASKS_FILE, tasks);

  res.status(201).json({
    success: true,
    message: "Vazifa muvaffaqiyatli yaratildi.",
    data: newTask,
  });
});

// GET /api/v1/tasks?status=todo&search=node
const getTasks = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  let tasks = await readJSON(TASKS_FILE);

  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      throw new ApiError(400, `status faqat quyidagilardan biri bo'lishi mumkin: ${VALID_STATUSES.join(", ")}`);
    }
    tasks = tasks.filter((t) => t.status === status);
  }

  if (search) {
    const query = search.toLowerCase();
    tasks = tasks.filter((t) => t.title.toLowerCase().includes(query));
  }

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// PUT /api/v1/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, status, assignedTo, projectId } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `status faqat quyidagilardan biri bo'lishi mumkin: ${VALID_STATUSES.join(", ")}`);
  }

  const tasks = await readJSON(TASKS_FILE);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    throw new ApiError(404, "Vazifa topilmadi.");
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...(title !== undefined && { title }),
    ...(status !== undefined && { status }),
    ...(assignedTo !== undefined && { assignedTo }),
    ...(projectId !== undefined && { projectId }),
    updatedAt: new Date().toISOString(),
  };

  tasks[taskIndex] = updatedTask;
  await writeJSON(TASKS_FILE, tasks);

  res.status(200).json({
    success: true,
    message: "Vazifa yangilandi.",
    data: updatedTask,
  });
});

// PATCH /api/v1/tasks/:id/status
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `status majburiy va quyidagilardan biri bo'lishi kerak: ${VALID_STATUSES.join(", ")}`);
  }

  const tasks = await readJSON(TASKS_FILE);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    throw new ApiError(404, "Vazifa topilmadi.");
  }

  tasks[taskIndex].status = status;
  tasks[taskIndex].updatedAt = new Date().toISOString();
  await writeJSON(TASKS_FILE, tasks);

  res.status(200).json({
    success: true,
    message: `Vazifa statusi "${status}" ga o'zgartirildi.`,
    data: tasks[taskIndex],
  });
});

// DELETE /api/v1/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tasks = await readJSON(TASKS_FILE);
  const exists = tasks.some((t) => t.id === id);

  if (!exists) {
    throw new ApiError(404, "Vazifa topilmadi.");
  }

  const updatedTasks = tasks.filter((t) => t.id !== id);
  await writeJSON(TASKS_FILE, updatedTasks);

  res.status(200).json({
    success: true,
    message: "Vazifa o'chirildi.",
  });
});

module.exports = { createTask, getTasks, updateTask, updateTaskStatus, deleteTask };
