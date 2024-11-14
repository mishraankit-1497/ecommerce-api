const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  routeName: {
    type: String,
    required: true,
  },
  items: [
    {
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
    },
  ],
});

const ShopModel = mongoose.model("Shop", shopSchema, "shops");
module.exports = ShopModel;
