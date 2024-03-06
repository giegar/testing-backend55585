import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";
import TicketModel from "../models/ticket.model.js";


class CartManager {

    addCart = async () => {

        try{
            const cart = {
                products: []
            }

            const newCart = await CartModel.create(cart)
            return {status:'Cart created', res: newCart}

        }catch(error){
            return error;
        };
    };

    getCarts = async () => {

        try{
            const carts = await CartModel.find()
            return carts;

        }catch(error){
            return error;
        };
    };

    getCartById = async (id) => {

        try{
            // const cart = await CartModel.findById(id)
            const cart = await CartModel.findOne({_id:id}).lean().exec()
            if(!cart) return "Cart not found";
            return cart;

        }catch(error){
            return error;
        };
    };

    addProductCart = async (cartId, productId) => {

        const productById = await ProductModel.findById(productId);
        if (!productById) return "Product not found"
    
        const cartById = await CartModel.findById(cartId)
        if (!cartById) return "Cart not found"
    
        const productExists = cartById.products.findIndex((item) => item.product.equals(pid))
    
        if (productExists !== -1) {
            cartById.products[productExists].quantity += 1
        } else {
            const newProduct = {
                product: pid,
                quantity: 1,
            }
            cartById.products.push(newProduct)
            }
    
        const result = await cartById.save()
        return result;
    };

    updateProductCart = async (cartId, productId, quant) => {

        const cart = await CartModel.findById(cartId);
        if (!cart) return 'Cart not found'

        const product = cart.products.findIndex((item) => item.product.equals(productId))
        if (product === -1) return 'Product not found'

        if (!quant || quant < 0) {
            await this.deleteProductCart(cartId, productId);
        }

        cart.products[productExists].quantity = quant;

        const result = await cart.save()
        return result;
    }

    deleteProductCart = async (cartId, productId) => {

        const cart = await CartModel.findById(cartId);
        if (!cart) return 'Cart not found'

        const product = cart.products.findIndex((item) => item.product.equals(productId))
        if (!product) return 'Product not found'

        cart.products.splice(product, 1)
        const result = await cart.save()
        return result;
    }

    emptyCart = async (cartId) => {

        const cart = await CartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true }).lean().exec();
        if (!cart) return 'Cart not found';
    }

    createTicket = async (ticket) => {
        const result = await TicketModel.create(ticket)
        return {status: 'Ticket created succesfully', res: result}
    }

    purchaseProducts = async (cid, email) => {

        const cart = await CartModel.findOne({_id:cid}).lean().exec()
        if(!cart) return {status: error, res: 'Cart ID not found'}

        const productsBuy = []
        const productsReturned = []
        let totalAmount = 0

        for (const products of cart.products){
            const product = await ProductModel.findOne(products.product)

            if(product.stock == 0){
                productsReturned.push(products)
            } 

            if(product.stock >= product.qty){
                product.stock -= products.qty
                await ProductModel.updateOne({_id: product._id}, {$set: product})
                productsBuy.push({product: product._id, quantity: products.qty})
                totalAmount += product.price * products.qty
            } else {
                productsReturned.push(products)
            }  
        }   

        if(productsBuy.length > 0){
            const newTicket ={
                code: Math.floor(Math.random() * 1000),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: email,
                products: productsBuy,
            }

            const ticket = await this.createTicket(newTicket)

            cart.products = productsReturned

            const newCart = await CartModel.updateOne({_id: cid}, cart)
            const result = await TicketModel.findOne({_id:ticket.res._id}).lean().exec()

            return {
                status: 'Success',
                ticket: result,
                cart: cart
            }}
    }
    
}
export default CartManager;