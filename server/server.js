const express = require("express");
const mongoose = require("mongoose");
const dashboardRoutes = require("./routes/dashboard");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });

const authRoutes = require("./routes/auth");
const monitorRoutes = require("./routes/monitors");
const { startScheduler } = require("./services/scheduler");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/monitors", monitorRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "WatchPlus API is running 🚀",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected successfully ✅");

    await startScheduler();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌", error.message);
  });