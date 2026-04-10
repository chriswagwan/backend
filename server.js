const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config();

const connectDB = require("./config/db");
const ensureAdminUser = require("./utils/ensureAdminUser");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const messageRoutes = require("./routes/messageRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const staffRoutes = require("./routes/staffRoutes");
const slideshowRoutes = require("./routes/slideshowRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigins = [
  "https://iremecivil.vercel.app",
  "https://iremecivil-fke64cvp1-chriswagwans-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Civil Works API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/slideshow", slideshowRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDB();
    await ensureAdminUser();

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  }
};

startServer();
