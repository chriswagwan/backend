const express = require("express");
const { body } = require("express-validator");
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

const serviceValidation = [
  body("name").trim().notEmpty().withMessage("Service name is required"),
  body("description").trim().notEmpty().withMessage("Service description is required"),
];

router.get("/", getServices);
router.post("/", protect, authorize("admin"), serviceValidation, validateRequest, createService);
router.put("/:id", protect, authorize("admin"), serviceValidation, validateRequest, updateService);
router.delete("/:id", protect, authorize("admin"), deleteService);

module.exports = router;
