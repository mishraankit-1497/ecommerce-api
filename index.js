const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const SignUpModel = require("./signup-model");
const uri =
  "mongodb+srv://mailankitmishra99:admin@mycluster.zxht5.mongodb.net/";
const dbName = "ecommerce";
const productCategory = require("./models");
const shopData = require("./shop-model");

const cors = require("cors");
// URI connection
mongoose
  .connect(uri, {
    dbName,
  })
  .then(() => {
    console.log("MongoDB connected!!");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Mongoose connected to database
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});
mongoose.connection.on("error", (err) => {
  console.log(err.message);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected");
});

//initialising express app
const app = express();
app.use(cors());
// initilising the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

// parsing the data when being communicated from express server to mongoDB
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.post("/user", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const displayName = req.body.displayName;
  let newSignUp = new SignUpModel({
    email,
    password,
    displayName,
  });
  newSignUp
    .save()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const resp = await SignUpModel.findOne({ email, password });
    if (!resp) {
      return res.status(404).json({ message: "Invalid email or password." });
    }
    return res.json(resp);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

app.get("/product-categories", async (req, res) => {
  try {
    const categories = await productCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ messsage: err.message });
  }
});

app.get("/shop", async (req, res) => {
  try {
    const shop = await shopData.find();
    res.json(shop);
  } catch (err) {
    res.status(500).json({ messsage: err.message });
  }
});

// NodeJS process to get exit
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// body
// qs
