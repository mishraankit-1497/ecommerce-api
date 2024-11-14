const mongoose = require("mongoose");

const signUpSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
});

const SignUpModel = mongoose.model("Signup", signUpSchema);
module.exports = SignUpModel;
