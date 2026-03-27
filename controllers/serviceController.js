const Service = require("../models/Service");
const asyncHandler = require("../utils/asyncHandler");

const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json(services);
});

const createService = asyncHandler(async (req, res) => {
  const service = await Service.create({
    name: req.body.name,
    description: req.body.description,
    icon: req.body.icon,
    highlights: req.body.highlights || [],
  });

  res.status(201).json(service);
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  service.name = req.body.name ?? service.name;
  service.description = req.body.description ?? service.description;
  service.icon = req.body.icon ?? service.icon;
  service.highlights = req.body.highlights ?? service.highlights;

  const updatedService = await service.save();
  res.json(updatedService);
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  await service.deleteOne();
  res.json({ message: "Service deleted successfully" });
});

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
