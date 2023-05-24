const mongoose = require("mongoose");

const outputSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    definition: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Output = mongoose.model("Output", outputSchema);

module.exports = Output;