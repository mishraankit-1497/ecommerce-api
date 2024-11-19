const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  categoryId: {
    type: Number,
    required: true,
  },
});

const ShopModel = mongoose.model("Shop", shopSchema, "products");
module.exports = ShopModel;
