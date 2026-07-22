const { v4: uuidv4 } = require("uuid");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { readJSON, writeJSON } = require("../utils/fileHandler");
const { PROJECTS_FILE, TASKS_FILE } = require("../utils/dataPaths");

// POST /api/v1/projects
const createProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const projects = await readJSON(PROJECTS_FILE);

  const newProject = {
    id: uuidv4(),
    title,
    description: description || "",
    ownerId: req.user.id, // joriy foydalanuvchi avtomatik egasi bo'ladi
    createdAt: new Date().toISOString(),
  };

  projects.push(newProject);
  await writeJSON(PROJECTS_FILE, projects);

  res.status(201).json({
    success: true,
    message: "Loyiha muvaffaqiyatli yaratildi.",
    data: newProject,
  });
});

// GET /api/v1/projects
const getProjects = asyncHandler(async (req, res) => {
  const projects = await readJSON(PROJECTS_FILE);

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

// GET /api/v1/projects/:id  - loyiha + unga tegishli barcha tasklar
const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const projects = await readJSON(PROJECTS_FILE);
  const project = projects.find((p) => p.id === id);

  if (!project) {
    throw new ApiError(404, "Loyiha topilmadi.");
  }

  const tasks = await readJSON(TASKS_FILE);
  const projectTasks = tasks.filter((t) => t.projectId === id);

  res.status(200).json({
    success: true,
    data: { ...project, tasks: projectTasks },
  });
});

// DELETE /api/v1/projects/:id  - faqat egasi yoki admin o'chira oladi
const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const projects = await readJSON(PROJECTS_FILE);
  const project = projects.find((p) => p.id === id);

  if (!project) {
    throw new ApiError(404, "Loyiha topilmadi.");
  }

  const isOwner = project.ownerId === req.user.id;
  const isAdminUser = req.user.role === "admin";

  if (!isOwner && !isAdminUser) {
    throw new ApiError(403, "Faqat loyiha egasi yoki Admin bu amalni bajara oladi.");
  }

  const updatedProjects = projects.filter((p) => p.id !== id);
  await writeJSON(PROJECTS_FILE, updatedProjects);

  // Loyiha bilan birga unga tegishli tasklarni ham tozalab qo'yamiz
  const tasks = await readJSON(TASKS_FILE);
  const updatedTasks = tasks.filter((t) => t.projectId !== id);
  await writeJSON(TASKS_FILE, updatedTasks);

  res.status(200).json({
    success: true,
    message: "Loyiha (va unga tegishli vazifalar) o'chirildi.",
  });
});

module.exports = { createProject, getProjects, getProjectById, deleteProject };
