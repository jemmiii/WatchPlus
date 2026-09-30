const express = require("express");
const Monitor = require("../models/Monitor");
const Check = require("../models/Check");
const protect = require("../middleware/auth");

const {
  scheduleMonitor,
  stopMonitor,
} = require("../services/scheduler");

const router = express.Router();

// All monitor routes require authentication
router.use(protect);

// Create monitor
router.post("/", async (req, res) => {
  try {
    const { name, url, interval } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        message: "name and url are required",
      });
    }

    const monitor = await Monitor.create({
      user: req.userId,
      name,
      url,
      interval: interval || 60,
    });

    scheduleMonitor(monitor);

    res.status(201).json({
      message: "Monitor created successfully",
      monitor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Get all monitors
router.get("/", async (req, res) => {
  try {
    const monitors = await Monitor.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(monitors);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Get monitor history
router.get("/:id/history", async (req, res) => {
  try {
    const monitor = await Monitor.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    const checks = await Check.find({
      monitor: req.params.id,
    })
      .sort({ checkedAt: -1 })
      .limit(100);

    res.json(checks);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Pause monitor
router.patch("/:id/pause", async (req, res) => {
  try {
    const monitor = await Monitor.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      { isActive: false },
      { new: true }
    );

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    stopMonitor(req.params.id);

    res.json({
      message: "Monitor paused successfully",
      monitor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Resume monitor
router.patch("/:id/resume", async (req, res) => {
  try {
    const monitor = await Monitor.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      { isActive: true },
      { new: true },
    );

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    scheduleMonitor(monitor);

    res.json({
      message: "Monitor resumed successfully",
      monitor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Delete monitor
router.delete("/:id", async (req, res) => {
  try {
    const monitor = await Monitor.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    stopMonitor(req.params.id);

    await Check.deleteMany({
      monitor: req.params.id,
    });

    res.json({
      message: "Monitor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;