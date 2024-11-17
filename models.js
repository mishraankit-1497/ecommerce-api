const mongoose = require("mongoose");

const productCategory = mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

const ProductCategory = mongoose.model("ProductCategory", productCategory, 'productcategories');
module.exports = ProductCategory;
