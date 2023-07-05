import React, { useEffect, useState } from "react";
import axios from "axios";

function Product() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  let [editProduct, setEditProduct] = useState(null);
  let [loading, setLoading] = useState(false);
  let [toggleReload, setToggleReload] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5001/product", {
        name,
        description,
        price,
      })
      .then((res) => {
        console.log(res);
        setToggleReload(!toggleReload);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        let response = await axios({
          url: "http://localhost:5001/products",
          method: "get",
        });
        if (response.status === 200) {
          console.log("response: ", response.data.data);
          setProducts(response.data.data.reverse());
        } else {
          console.log("error in api call");
        }
      } catch (e) {
        console.log("Error in api call: ", e);
      }
    };
    getAllProducts();
  }, [toggleReload]);

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/product/${id}`
      );
      console.log("response: ", response.data);

      setLoading(false);
      setToggleReload(!toggleReload);
    } catch (error) {
      console.log("error in getting all products", error);
      setLoading(false);
    }
  };
  let updateHandler = async (e) => {
    e.preventDefault();

    try {
      let updated = await axios.put(
        `http://localhost:5001/product/${editProduct?._id}`,
        {
          name: editProduct.name,
          price: editProduct.price,
          description: editProduct.description,
        }
      );
      console.log("updated: ", updated.data);

      setToggleReload(!toggleReload);
      setEditProduct(null);
    } catch (e) {
      console.log("Error in api call: ", e);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="productForm">
        <form onSubmit={submitHandler}>
          <h1>Enter a product</h1>
          Name
          <input
            name="name"
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
          />
          Description
          <input
            type="text"
            name="description"
            id="description"
            onChange={(e) => setDescription(e.target.value)}
          />
          Price
          <input
            type="text"
            name="price"
            id="price"
            onChange={(e) => setPrice(e.target.value)}
          />
          <button type="submit">Add Product</button>
        </form>

        <hr />

        {editProduct !== null ? (
          <div>
            <h1>update form</h1>
            <form onSubmit={updateHandler}>
              Name:{" "}
              <input
                type="text"
                onChange={(e) => {
                  setEditProduct({ ...editProduct, name: e.target.value });
                }}
                value={editProduct.name}
              />{" "}
              <br />
              Price:{" "}
              <input
                type="text"
                onChange={(e) => {
                  setEditProduct({ ...editProduct, price: e.target.value });
                }}
                value={editProduct.price}
              />{" "}
              <br />
              Description:{" "}
              <input
                type="text"
                onChange={(e) => {
                  setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  });
                }}
                value={editProduct.description}
              />{" "}
              <br />
              <button type="submit"> Proceed Update </button>
            </form>
          </div>
        ) : null}

        <hr />
        <div>
          {products?.map((eachProduct) => (
            <div key={eachProduct?._id}>
              <h3>{eachProduct?.name}</h3>
              <div>{eachProduct?.price}</div>
              <div>{eachProduct?.description}</div>

              <button
                onClick={() => {
                  deleteProduct(eachProduct._id);
                }}
              >
                Delete
              </button>

              <button
                onClick={() => {
                  setEditProduct({
                    _id: eachProduct._id,
                    name: eachProduct?.name,
                    price: eachProduct?.price,
                    description: eachProduct?.description,
                  });
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product;
