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
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("message").trim().notEmpty().withMessage("Message is required"),
  ],
  validateRequest,
  createMessage
);

router.get("/", protect, authorize("admin"), getMessages);
router.patch("/:id/read", protect, authorize("admin"), markMessageAsRead);

module.exports = router;
