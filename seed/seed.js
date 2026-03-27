const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const Project = require("../models/Project");
const Service = require("../models/Service");
const Message = require("../models/Message");
const CompanySettings = require("../models/CompanySettings");
const { projects, services } = require("./data");

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Project.deleteMany(),
      Service.deleteMany(),
      Message.deleteMany(),
      CompanySettings.deleteMany(),
    ]);

    await User.create({
      name: "Admin User",
      email: "admin@civilworksco.com",
      password: "Admin123!",
      role: "admin",
    });

    await Service.insertMany(services);
    await Project.insertMany(projects);
    await CompanySettings.create({});

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
