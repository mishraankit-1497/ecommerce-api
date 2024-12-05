const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserModel = require("./signup-model");
const ShopItems = require("./shop-model");

const orderSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["COMPLETED", "REJECTED", "FAILED"], // Enum to enforce the allowed status values
    required: true,
  },
  transactionTime: {
    type: Date,
    required: true,
    default: Date.now, // Automatically set the transaction time to the current date and time
  },
  transactionAmount: {
    type: Number,
    required: true,
  },
  currencyCode: {
    type: String,
    required: true,
  },
  payerName: {
    type: String,
    required: true,
  },
  payerEmail: {
    type: String,
    required: true,
  },
  payerId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
  },
  orderedItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ShopItems,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;
