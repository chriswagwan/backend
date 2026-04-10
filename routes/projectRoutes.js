const express = require("express");
const { body } = require("express-validator");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const validateObjectId = require("../middleware/validateObjectId");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

const projectValidation = [
  body("title").trim().notEmpty().withMessage("Project title is required"),
  body("slug").trim().notEmpty().withMessage("Project slug is required"),
  body("description").trim().notEmpty().withMessage("Project description is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("status").isIn(["planned", "ongoing", "completed"]).withMessage("Status is invalid"),
];

router.get("/", getProjects);
router.get("/:id", validateObjectId(), getProjectById);
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images", 4),
  projectValidation,
  validateRequest,
  createProject
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateObjectId(),
  upload.array("images", 4),
  projectValidation,
  validateRequest,
  updateProject
);
router.delete("/:id", protect, authorize("admin"), validateObjectId(), deleteProject);

module.exports = router;
