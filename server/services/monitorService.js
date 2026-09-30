const Monitor = require("../models/Monitor");
const Check = require("../models/Check");

async function updateUptime(monitorId) {
  const checks = await Check.find({
    monitor: monitorId,
  }).sort({ checkedAt: -1 });

  if (checks.length === 0) {
    return 0;
  }

  const successfulChecks = checks.filter(
    (check) => check.status === "up"
  ).length;

  return Number(
    ((successfulChecks / checks.length) * 100).toFixed(2)
  );
}

async function checkMonitor(monitor) {
  const startTime = Date.now();

  try {
    const response = await fetch(monitor.url, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    });

    const responseTime = Date.now() - startTime;
    const status = response.ok ? "up" : "down";

    await Check.create({
      monitor: monitor._id,
      status,
      statusCode: response.status,
      responseTime,
      checkedAt: new Date(),
    });

    const uptime = await updateUptime(monitor._id);

    monitor.status = status;
    monitor.responseTime = responseTime;
    monitor.uptime = uptime;
    monitor.lastChecked = new Date();

    await monitor.save();

    console.log(
      `${monitor.name} → ${status.toUpperCase()} → ${response.status} → ${responseTime}ms → Uptime: ${uptime}%`
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;

    await Check.create({
      monitor: monitor._id,
      status: "down",
      statusCode: null,
      responseTime,
      errorMessage: error.message,
      checkedAt: new Date(),
    });

    const uptime = await updateUptime(monitor._id);

    monitor.status = "down";
    monitor.responseTime = responseTime;
    monitor.uptime = uptime;
    monitor.lastChecked = new Date();

    await monitor.save();

    console.log(
      `${monitor.name} → DOWN → ${error.message} → Uptime: ${uptime}%`
    );
  }
}

module.exports = {
  checkMonitor,
};