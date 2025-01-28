const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, 
    },
    price: {
      type: Number,
      required: true,
      min: 0, 
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
