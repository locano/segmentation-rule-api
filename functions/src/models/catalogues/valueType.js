const mongoose = require("mongoose");

const valueTypeSchema = mongoose.Schema(
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
    }
  },
  {
    timestamps: true,
  }
);

const ValueType = mongoose.model("ValueType", valueTypeSchema);

module.exports = ValueType;