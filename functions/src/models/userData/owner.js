const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }
  }
);

const Owner = mongoose.model("Owner", ownerSchema);

module.exports = Owner;