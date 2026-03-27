const User = require("../models/User");
const Project = require("../models/Project");
const Service = require("../models/Service");
const Message = require("../models/Message");
const CompanySettings = require("../models/CompanySettings");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProjects,
    totalServices,
    totalMessages,
    totalSettings,
    recentProjects,
    recentMessages,
  ] =
    await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Service.countDocuments(),
      Message.countDocuments(),
      CompanySettings.countDocuments(),
      Project.find().sort({ createdAt: -1 }).limit(4),
      Message.find().sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({
    totals: {
      users: totalUsers,
      projects: totalProjects,
      services: totalServices,
      messages: totalMessages,
      settings: totalSettings,
    },
    recentProjects,
    recentMessages,
  });
});

module.exports = {
  getDashboardStats,
};
