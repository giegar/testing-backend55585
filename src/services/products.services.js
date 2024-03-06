import ProductManager from "../dao/managers/productManagerMongo.js";

const productManager = new ProductManager();

export default class ProductServices {

    getProducts = async (limit, page, sort, query) => {
        return await productManager.getProducts(limit, page, sort, query);
    }

    addProduct = async (product) => {
        return await productManager.addProduct(product);
    }

    getProductById = async (id) => {
        return await productManager.getProductById(id);
    }

    updateProduct = async (id, product) => {
        return await productManager.updateProduct(id, product);
    }

    deleteProduct = async (id) => {
        return await productManager.deleteProduct(id);
    }

}