const mongoose = require("mongoose");

const checkSchema = new mongoose.Schema(
  {
    monitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
    },

    status: {
      type: String,
      enum: ["up", "down"],
      required: true,
    },

    statusCode: {
      type: Number,
      default: null,
    },

    responseTime: {
      type: Number,
      default: 0,
    },

    errorMessage: {
      type: String,
      default: null,
    },

    checkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Check", checkSchema);