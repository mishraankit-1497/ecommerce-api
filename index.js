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
const ProductCategory = require("./models");
const ShopModel = require("./shop-model");
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

app.post("/product-categories", async (req, res) => {
  try {
    const { title, id, imageUrl } = req.body;
    let productCategory = new ProductCategory({ title, id, imageUrl });
    productCategory
      .save()
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (err) {
    res.status(500).json({ messsage: err.message });
  }
});

app.delete("/product-categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCategory = await ProductCategory.deleteOne({ id });
    res.send(deleteCategory);
  } catch (error) {
    res.send(error);
  }
});

app.post("/shop", async (req, res) => {
  try {
    const categoryProduct = req.body;
    const categoryExists = await ShopModel.findOne({ id: categoryProduct.id });
    console.log(categoryExists);
    if (!categoryExists) {
      // New product category
      let products = new ShopModel(categoryProduct);
      products
        .save()
        .then((resp) => {
          console.log(resp);
          res.send(resp);
        })
        .catch((error) => console.log("Not able to create product", error));
    } else {
      // Existing product category

      const { id, items } = req.body; // Destructing incoming data
      const product = items[0]; // Assuming you are sending one product at a time
      // $ represent for match
      // $set for setting the exisiting one in mongo
      const update = {
        $set: {
          "items.$": product, // aggregation
        },
      };
      let newProducts = ShopModel.updateOne(
        { id: id, "items.id": product.id },
        update,
        {
          upsert: false, // if upsert: true --> add new record
          // ensuring only items get updated
          // Instead of changing title or routeName, it ensures it updated only the product item
          arrayFilters: [
            {
              "items.id": product.id,
            },
          ],
        }
      ).then((resp) => {
        res.send(resp);
      });
      console.log(newProducts);
    }
  } catch (error) {
    res.send(error);
  }
});

app.put("/shop", async (req, res) => {
  try {
    const categoryProduct = req.body;
    const categoryExists = await ShopModel.findOne({ id: categoryProduct.id });
    if (categoryExists) {
      // Existing product category

      const { id, items } = req.body; // Destructing incoming data
      const product = items[0]; // Assuming you are sending one product at a time
      // $ represent for match
      // $set for setting the exisiting one in mongo
      const update = {
        $set: {
          "items.$": product, // aggregation
        },
      };
      let newProducts = ShopModel.updateOne(
        { id: id, "items.id": product.id },
        update,
        {
          upsert: false, // if upsert: true --> add new record
          // ensuring only items get updated
          // Instead of changing title or routeName, it ensures it updated only the product item
          arrayFilters: [
            {
              "items.id": product.id,
            },
          ],
        }
      ).then((resp) => {
        res.send(resp);
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// app.delete("/product-categories/:id", async (req, res) => {
//   console.log(req.params);
//   const category = await ProductCategory.deleteOne({ id: req.params.id });
//   console.log(category);
//   if (!category) {
//     return next(
//       res.status(204).json({
//         status: "success",
//         message: "No product category found with that ID",
//         data: null,
//       })
//     );
//   }
//   res.status(200).json({
//     status: "success",
//     message: "category deleted successfully",
//     data: null,
//   });
// });

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
