const User = require("../models/User");

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@civilworksco.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const adminName = process.env.ADMIN_NAME || "Admin User";

  const existingAdmin = await User.findOne({ role: "admin" });

  if (existingAdmin) {
    return;
  }

  await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });

  console.log(`Bootstrap admin created for ${adminEmail}`);
};

module.exports = ensureAdminUser;
