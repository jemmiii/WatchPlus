const Monitor = require("../models/Monitor");
const { checkMonitor } = require("./monitorService");

const intervals = new Map();

async function startScheduler() {
  const monitors = await Monitor.find({ isActive: true });

  console.log(
    `Scheduler started for ${monitors.length} monitor(s) 🚀`
  );

  monitors.forEach((monitor) => {
    scheduleMonitor(monitor);
  });
}

function scheduleMonitor(monitor) {
  const monitorId = monitor._id.toString();

  // Prevent duplicate scheduler
  stopMonitor(monitorId);

  // Run immediately
  checkMonitor(monitor);

  // Run repeatedly
  const intervalId = setInterval(() => {
    checkMonitor(monitor);
  }, monitor.interval * 1000);

  intervals.set(monitorId, intervalId);

  console.log(
    `${monitor.name} scheduler active → every ${monitor.interval}s`
  );
}

function stopMonitor(monitorId) {
  const intervalId = intervals.get(monitorId);

  if (intervalId) {
    clearInterval(intervalId);
    intervals.delete(monitorId);

    console.log(`Monitor ${monitorId} scheduler stopped ⏸️`);
  }
}

function stopScheduler() {
  for (const intervalId of intervals.values()) {
    clearInterval(intervalId);
  }

  intervals.clear();

  console.log("All schedulers stopped 🛑");
}

module.exports = {
  startScheduler,
  scheduleMonitor,
  stopMonitor,
  stopScheduler,
};