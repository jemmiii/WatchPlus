const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    interval: {
      type: Number,
      default: 60,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["up", "down", "unknown"],
      default: "unknown",
    },

    responseTime: {
      type: Number,
      default: 0,
    },

    uptime: {
      type: Number,
      default: 0,
    },

    lastChecked: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Monitor ||
  mongoose.model("Monitor", monitorSchema);