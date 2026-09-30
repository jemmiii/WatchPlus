const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config({ path: "../.env" });

const authRoutes = require("./routes/auth");
const monitorRoutes = require("./routes/monitors");
const dashboardRoutes = require("./routes/dashboard");
const { startScheduler } = require("./services/scheduler");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin:
      process.env.CLIENT_URL || "http://localhost:5173",
  })
);

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

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌", error.message);
  });