const crypto = require("crypto");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;
const getClientUrl = () => (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

const normalizeEmail = (email) => email.trim().toLowerCase();

const buildAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken(user),
});

const buildResetTokenHash = (token) => crypto.createHash("sha256").update(token).digest("hex");

const buildResetLink = (token) => `${getClientUrl()}/reset-password/${token}`;

const issueResetTokenForUser = async (user) => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  user.resetToken = buildResetTokenHash(rawToken);
  user.resetTokenExpires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
  await user.save();

  return buildResetLink(rawToken);
};

const findUserByResetToken = (token) =>
  User.findOne({
    resetToken: buildResetTokenHash(token),
    resetTokenExpires: { $gt: new Date() },
  });

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
  });

  res.status(201).json(buildAuthResponse(user));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: normalizeEmail(email) });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json(buildAuthResponse(user));
});

const updateAdminCredentials = asyncHandler(async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const admin = await User.findById(req.user._id);

  if (!admin) {
    res.status(404);
    throw new Error("Admin account not found");
  }

  if (!(await admin.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  const nextEmail = email ? normalizeEmail(email) : admin.email;
  const isChangingEmail = nextEmail !== admin.email;
  const isChangingPassword = Boolean(newPassword);

  if (!isChangingEmail && !isChangingPassword) {
    res.status(400);
    throw new Error("Provide a new email, a new password, or both");
  }

  if (isChangingEmail) {
    const existingUser = await User.findOne({ email: nextEmail, _id: { $ne: admin._id } });

    if (existingUser) {
      res.status(400);
      throw new Error("A user with this email already exists");
    }

    admin.email = nextEmail;
  }

  if (isChangingPassword) {
    admin.password = newPassword;
  }

  admin.resetToken = undefined;
  admin.resetTokenExpires = undefined;
  await admin.save();

  res.json({
    message: "Login credentials updated successfully",
    user: buildAuthResponse(admin),
  });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body.email);
  const user = await User.findOne({ email: normalizedEmail, role: "admin" });

  if (!user) {
    res.json({
      message: "If an admin account exists for that email, a password reset link has been generated.",
    });
    return;
  }

  const resetLink = await issueResetTokenForUser(user);

  res.json({
    message: "Password reset link generated successfully.",
    resetLink,
    expiresIn: 3600,
  });
});

const verifyResetToken = asyncHandler(async (req, res) => {
  const user = await findUserByResetToken(req.params.token);

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired password reset link");
  }

  res.json({
    message: "Password reset link is valid",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const user = await findUserByResetToken(req.params.token);

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired password reset link");
  }

  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({
    message: "Password reset successfully",
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const verifyAdminKey = asyncHandler(async (req, res) => {
  const { key } = req.body;

  if (!key) {
    res.status(400);
    throw new Error("Access key is required");
  }

  const adminSecretKey = process.env.ADMIN_SECRET_KEY;

  if (!adminSecretKey) {
    console.error("ADMIN_SECRET_KEY is not configured");
    res.status(500);
    throw new Error("Admin access is not configured");
  }

  if (key === adminSecretKey) {
    res.json({ success: true });
  } else {
    res.status(401);
    throw new Error("Invalid access key");
  }
});

module.exports = {
  registerUser,
  loginUser,
  updateAdminCredentials,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  getProfile,
  verifyAdminKey,
};
