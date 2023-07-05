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
  "mongodb+srv://abc:abc@cluster0.hhohvzv.mongodb.net/productDatabase?retryWrites=true&w=majorit";

// create product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true  },
  createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model("product", productSchema);

// To create or add new product
app.post("/product", async (req, res) => {
  let body = req.body;
  //validation
  if (!body.name || !body.description || !body.price) {
    res.status(400).send("required parameters missing");
    return;
  }
  console.log(body.name);
  console.log(body.price);
  console.log(body.description);

  productModel
    .create({
      name: body.name,
      description: body.description,
      price: body.price,
    })
    .then((product) => {
      res.status(200).send({
        message: "product created",
        data: product,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "product not created",
        data: err,
      });
    });
});
// To get All products
app.get("/products", async (req, res) => {
  productModel
    .find()
    .then((products) => {
      res.status(200).send({
        message: "products found",
        data: products,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "products not found",
        data: err,
      });
    });
});
// To get single product
app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  productModel
    .findById(id)
    .then((product) => {
      res.status(200).send({
        message: "product found",
        data: product,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "product not found",
        data: err,
      });
    });
});

// To delete single product
app.delete("/product/:id", async (req, res) => {
  const id = req.params.id;
  productModel
    .findByIdAndDelete(id)
    .then((product) => {
      res.status(200).send({
        message: "product deleted successfully",
        data: product,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "product not deleted",
        data: err,
      });
    });
});

// To edit single product
app.put("/product/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  if (!body.name || !body.description || !body.price) {
    res.status(400).send("required parameters missing");
    return;
  }

  productModel
    .findByIdAndUpdate(id, {
      name: body.name,
      price: body.price,
      description: body.description,
    })
    .then((product) => {
      res.status(200).send({
        message: "product updated successfully",
        data: product,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "product not updated",
        data: err,
      });
    });
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
