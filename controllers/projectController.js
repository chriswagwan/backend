const path = require("path");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

const normalizeImages = (req, bodyImages = []) => {
  const uploadedImages =
    req.files?.map((file) => `${req.protocol}://${req.get("host")}/uploads/${path.basename(file.path)}`) || [];

  if (!bodyImages?.length) {
    return uploadedImages;
  }

  return [...bodyImages, ...uploadedImages];
};

const getProjects = asyncHandler(async (req, res) => {
  const { featured, status } = req.query;
  const filters = {};

  if (featured) {
    filters.featured = featured === "true";
  }

  if (status) {
    filters.status = status;
  }

  const projects = await Project.find(filters).sort({ createdAt: -1 });
  res.json(projects);
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json(project);
});

const createProject = asyncHandler(async (req, res) => {
  const images = normalizeImages(req, req.body.existingImages);

  const project = await Project.create({
    title: req.body.title,
    slug: req.body.slug,
    description: req.body.description,
    location: req.body.location,
    category: req.body.category,
    status: req.body.status,
    featured: req.body.featured === "true" || req.body.featured === true,
    completionDate: req.body.completionDate || undefined,
    images,
  });

  res.status(201).json(project);
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const existingImages = Array.isArray(req.body.existingImages)
    ? req.body.existingImages
    : req.body.existingImages
      ? [req.body.existingImages]
      : project.images;

  project.title = req.body.title ?? project.title;
  project.slug = req.body.slug ?? project.slug;
  project.description = req.body.description ?? project.description;
  project.location = req.body.location ?? project.location;
  project.category = req.body.category ?? project.category;
  project.status = req.body.status ?? project.status;
  project.featured =
    req.body.featured !== undefined
      ? req.body.featured === "true" || req.body.featured === true
      : project.featured;
  project.completionDate = req.body.completionDate ?? project.completionDate;
  project.images = normalizeImages(req, existingImages);

  const updatedProject = await project.save();
  res.json(updatedProject);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  await project.deleteOne();
  res.json({ message: "Project deleted successfully" });
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
