const express = require("express");
const { body, param } = require("express-validator");
const {
  registerUser,
  loginUser,
  updateAdminCredentials,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  getProfile,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validateRequest,
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  loginUser
);

router.put(
  "/admin-credentials",
  protect,
  authorize("admin"),
  [
    body("email").optional().isEmail().withMessage("A valid email is required"),
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .optional({ values: "falsy" })
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
    body("confirmNewPassword")
      .optional({ values: "falsy" })
      .custom((value, { req }) => !req.body.newPassword || value === req.body.newPassword)
      .withMessage("New passwords do not match"),
  ],
  validateRequest,
  updateAdminCredentials
);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("A valid email is required")],
  validateRequest,
  requestPasswordReset
);

router.get(
  "/verify-reset-token/:token",
  [param("token").trim().notEmpty().withMessage("Token is required")],
  validateRequest,
  verifyResetToken
);

router.post(
  "/reset-password/:token",
  [
    param("token").trim().notEmpty().withMessage("Token is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Password confirmation is required")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ],
  validateRequest,
  resetPassword
);

router.get("/profile", protect, getProfile);

module.exports = router;
