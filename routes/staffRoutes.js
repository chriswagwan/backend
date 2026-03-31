const express = require("express");
const { body } = require("express-validator");
const {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} = require("../controllers/staffController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

const staffValidation = [
  body("name").trim().notEmpty().withMessage("Staff name is required"),
  body("title").trim().notEmpty().withMessage("Staff title is required"),
  body("email").optional({ checkFalsy: true }).isEmail().withMessage("Enter a valid email address"),
  body("phone").optional({ checkFalsy: true }).trim(),
  body("description").trim().notEmpty().withMessage("Staff description is required"),
];

router.get("/", getStaff);
router.get("/:id", getStaffById);
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("photo"),
  staffValidation,
  validateRequest,
  createStaff
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("photo"),
  staffValidation,
  validateRequest,
  updateStaff
);
router.delete("/:id", protect, authorize("admin"), deleteStaff);

module.exports = router;
