const mongoose = require("mongoose");

const fieldTypeSchema = mongoose.Schema(
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

const FieldTypes = mongoose.model("FieldTypes", fieldTypeSchema);

module.exports = FieldTypes;