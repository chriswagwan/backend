const Slideshow = require("../models/Slideshow");
const asyncHandler = require("../utils/asyncHandler");

const getSlides = asyncHandler(async (req, res) => {
  const filter = req.query.active === "true" ? { active: true } : {};
  const slides = await Slideshow.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(slides);
});

const createSlide = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("At least one image is required");
  }

  const baseOrder = Number(req.body.order) || 0;
  const slides = await Slideshow.insertMany(
    req.files.map((file, i) => ({
      title: req.body.title || "",
      image: file.path,
      order: baseOrder + i,
      active: req.body.active !== "false",
    }))
  );

  res.status(201).json(slides);
});

const updateSlide = asyncHandler(async (req, res) => {
  const slide = await Slideshow.findById(req.params.id);

  if (!slide) {
    res.status(404);
    throw new Error("Slide not found");
  }

  slide.title = req.body.title ?? slide.title;
  slide.order = req.body.order ?? slide.order;
  if (req.body.active !== undefined) {
    slide.active = req.body.active === "true" || req.body.active === true;
  }
  if (req.file) {
    slide.image = req.file.path;
  }

  const updatedSlide = await slide.save();
  res.json(updatedSlide);
});

const deleteSlide = asyncHandler(async (req, res) => {
  const slide = await Slideshow.findById(req.params.id);

  if (!slide) {
    res.status(404);
    throw new Error("Slide not found");
  }

  await slide.deleteOne();
  res.json({ message: "Slide deleted successfully" });
});

module.exports = {
  getSlides,
  createSlide,
  updateSlide,
  deleteSlide,
};
