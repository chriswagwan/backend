const Staff = require("../models/Staff");
const asyncHandler = require("../utils/asyncHandler");

const getPhotoUrl = (req, file) => {
  if (!file) return null;
  return file.path;
};

const getStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.find().sort({ createdAt: 1 });
  res.json(staff);
});

const getStaffById = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  res.json(staff);
});

const createStaff = asyncHandler(async (req, res) => {
  let photo = "";
  if (req.file) {
    photo = getPhotoUrl(req, req.file);
  }

  const staff = await Staff.create({
    name: req.body.name,
    title: req.body.title,
    email: req.body.email || "",
    phone: req.body.phone || "",
    description: req.body.description,
    photo,
  });

  res.status(201).json(staff);
});

const updateStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  staff.name = req.body.name ?? staff.name;
  staff.title = req.body.title ?? staff.title;
  staff.email = req.body.email ?? staff.email;
  staff.phone = req.body.phone ?? staff.phone;
  staff.description = req.body.description ?? staff.description;

  if (req.file) {
    staff.photo = getPhotoUrl(req, req.file);
  }

  const updatedStaff = await staff.save();
  res.json(updatedStaff);
});

const deleteStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  await staff.deleteOne();
  res.json({ message: "Staff member deleted successfully" });
});

module.exports = {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
