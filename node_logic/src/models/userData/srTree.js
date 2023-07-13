const mongoose = require("mongoose");

const srTreeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    settings: {
      type: Object,
    },
    schedule: {
      type: Array,
    },
    metrics: {
      type: Array,
    },
    variables: {
      type: Array,
    },
    owners: {
      type: Array,
    },
    conditions: {
      type: Array
    },
    nodes:{
      type: Array
    },
    versions: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const SrTree = mongoose.model("SrTree", srTreeSchema);

module.exports = SrTree;