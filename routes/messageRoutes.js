const express = require("express");
const { body } = require("express-validator");
const {
  createMessage,
  getMessages,
  markMessageAsRead,
} = require("../controllers/messageController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .bail()
      .isLength({ min: 2, max: 80 })
      .withMessage("Name must be between 2 and 80 characters"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("A valid email is required")
      .normalizeEmail(),
    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .bail()
      .matches(/^\+[0-9]{1,4}\s[0-9]{9}$/)
      .withMessage("Phone number must include a country code and exactly 9 digits"),
    body("subject")
      .trim()
      .notEmpty()
      .withMessage("Subject is required")
      .bail()
      .isLength({ min: 3, max: 120 })
      .withMessage("Subject must be between 3 and 120 characters"),
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Message is required")
      .bail()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Message must be between 10 and 2000 characters"),
  ],
  validateRequest,
  createMessage
);

router.get("/", protect, authorize("admin"), getMessages);
router.patch("/:id/read", protect, authorize("admin"), markMessageAsRead);

module.exports = router;
