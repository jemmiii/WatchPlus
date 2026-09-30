const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
});

const Monitor = require("../models/Monitor");
const { checkMonitor } = require("./monitorService");

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const monitor = await Monitor.findOne({
      name: "Google",
    });

    if (!monitor) {
      console.log("Monitor not found ❌");
      return;
    }

    await checkMonitor(monitor);

    console.log("Monitor check completed ✅");
  } catch (error) {
    console.error("Test failed ❌", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

test();