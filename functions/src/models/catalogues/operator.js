const mongoose = require("mongoose");

const operatorSchema = mongoose.Schema(
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

const Operator = mongoose.model("Operator", operatorSchema);

module.exports = Operator;