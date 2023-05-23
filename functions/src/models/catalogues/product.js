const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: Object,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;