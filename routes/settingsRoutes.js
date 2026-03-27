const express = require("express");
const { body } = require("express-validator");
const { getCompanySettings, updateCompanySettings } = require("../controllers/settingsController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.get("/", getCompanySettings);

router.put(
  "/",
  protect,
  authorize("admin"),
  [
    body("companyName").optional().trim().notEmpty().withMessage("Company name cannot be empty"),
    body("contactEmail").optional().isEmail().withMessage("A valid contact email is required"),
    body("contactPhone").optional().trim().notEmpty().withMessage("Contact phone cannot be empty"),
  ],
  validateRequest,
  updateCompanySettings
);

module.exports = router;
