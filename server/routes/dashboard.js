const express = require("express");
const Monitor = require("../models/Monitor");
const protect = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// Dashboard overview
router.get("/overview", async (req, res) => {
  try {
    const monitors = await Monitor.find({
      user: req.userId,
    });

    const totalMonitors = monitors.length;

    const onlineMonitors = monitors.filter(
      (monitor) => monitor.status === "up"
    ).length;

    const averageUptime =
      totalMonitors > 0
        ? Number(
            (
              monitors.reduce(
                (sum, monitor) => sum + monitor.uptime,
                0
              ) / totalMonitors
            ).toFixed(2)
          )
        : 0;

    const monitorsWithResponseTime = monitors.filter(
      (monitor) => monitor.responseTime > 0
    );

    const averageResponseTime =
      monitorsWithResponseTime.length > 0
        ? Math.round(
            monitorsWithResponseTime.reduce(
              (sum, monitor) => sum + monitor.responseTime,
              0
            ) / monitorsWithResponseTime.length
          )
        : 0;

    res.json({
      totalMonitors,
      onlineMonitors,
      averageUptime,
      averageResponseTime,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;