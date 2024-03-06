import CartManager from "../dao/managers/cartManagerMongo.js";

const cartManager = new CartManager;

export default class CartServices {

    addCart = async () => {
        return await cartManager.addCart();
    }

    getCarts = async () => {
        return await cartManager.getCarts();
    }

    getCartById = async (id) => {
        return await cartManager.getCartById(id);
    }

    addProductCart = async (cartId, productId) => {
        return await cartManager.addProductCart(cartId, productId);
    }

    updateProductCart = async (cartId, productId, quant) => {
        return await cartManager.updateProductCart(cartId, productId, quant);
    }

    deleteProductCart = async (cartId, productId) => {
        return await cartManager.deleteProductCart(cartId, productId);
    }

    emptyCart = async (cartId) => {
        return await cartManager.emptyCart(cartId);
    }

    createTicket = async (ticket) => {
        return await cartManager.createTicket(ticket)
    }

    purchaseProducts = async (cid, email) => {
        return await cartManager.purchaseProducts(cid, email)
    }
}