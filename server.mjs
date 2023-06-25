import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5001;
const mongodbUrl =
  process.env.mongodbUrl ||
  "mongodb+srv://abc:abc@cluster0.hhohvzv.mongodb.net/?retryWrites=true&w=majorit";

let products = [];
// create product schema
let productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  description: String,
  createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model("products", productSchema);

// To create or add new product
app.post("/product", (req, res) => {
  const body = req.body;
  console.log(body);
  if (!body.name || !body.price || !body.description) {
    res.status(400).send({
      message: "please fill all the fields",
    });
    return;
  }
  console.log(body.name);
  console.log(body.price);
  console.log(body.description);

  productModel.create(
    {
      name: body.name,
      price: body.price,
      description: body.description,
    },
    (err, saved) => {
      if (!err) {
        console.log(saved);

        res.send({
          message: "product added successfully",
        });
      } else {
        res.status(500).send({
          message: "server error",
        });
      }
    }
  );
});

// To get all Products
app.get("/products", (req, res) => {
  res.send({
    data: products,
    message: "all products",
  });
});

// To get single Product
app.get("/product/:id", (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id == id);
  if (!product) {
    res.status(404).send({
      message: "product not found",
    });
    return;
  }
  res.send({
    message: "product found",
  });
  console.log(product);
});
// To delete single product
app.delete("/product/:id", (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id == id);
  if (!product) {
    res.status(404).send({
      message: "product not found",
    });
    return;
  }
  products.splice(product, 1);
  res.send({
    message: "product deleted successfully",
  });
});
// To edit single product
app.put("/product/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  if (!body.name || !body.price || !body.description) {
    res.status(400).send({
      message: "please fill all the fields",
    });
    return;
  }
  const product = products.find((p) => p.id == id);
  if (!product) {
    res.status(404).send({
      message: "product not found",
    });
  } else {
    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    res.status(200).send({
      message: "product updated",
    });
  }
});

const __dirname = path.resolve();
app.use("/", express.static(path.join(__dirname, "./web/build")));
app.use("*", express.static(path.join(__dirname, "./web/build")));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(mongodbUrl);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function () {
  //connected
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
