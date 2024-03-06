import express from "express";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/products.controllers.js";
import { current } from "../middlewares/middlewares.js";

const productRouter = express.Router();

const rol = ["premium"]

productRouter.get("/", getProducts)

productRouter.get("/:pid", getProductById)

productRouter.post("/", addProduct)

productRouter.put("/:pid", updateProduct)

productRouter.delete("/:pid", current(rol), deleteProduct)

export default productRouter;