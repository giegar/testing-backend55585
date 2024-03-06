import ProductModel from "../dao/models/product.model.js";
import CartModel from "../dao/models/cart.model.js";
import ProductManager from "../dao/managers/productManagerMongo.js";
import { getProducts } from "../controllers/products.controllers.js";

import { Router } from "express";
import passport from "passport";
import { auth, publicAccess, current } from "../middlewares/middlewares.js";

const viewsRouter = Router()
const productManager = new ProductManager();
const rol = ["admin"]

viewsRouter.get("/login", publicAccess, (req, res) => {
        const user = req.session.user;
        res.render("partials/login", {
            title: "Inicia sesion"
    })
})

viewsRouter.get("/register", publicAccess, (req, res) => {
    res.render("partials/register", {
        title: "Registrate"
    })
})

// -------- Vista de ticket
viewsRouter.get('/:cid/purchase', auth, passport.authenticate('jwt', {session: false}), async (req, res) => {
    const id = req.params.cid
    const {email} = req.user.user
    
    const {ticket, cart} = await CartServices.purchaseProducts(id,email)

    console.log(ticket)

    res.render('ticket', {
        style: 'style.css',
        ticket,
        cart
    })
})

// -------- Productos con paginacion
viewsRouter.get("/products", publicAccess, async (req, res) => {

    const limit = req.query?.limit ?? 10
    const page = req.query?.page ?? 1
    const sort = req.query?.sort
    const query = req.query?.query
    const user = req.session.user

    /* const limit = parseInt(req.query?.limit ?? 10);
    const page = parseInt(req.query?.page ?? 1);
    const sort = req.query.sort ?? '' ;

    const user = req.session.user; */

    //const products = await getProducts(limit, page, sort, query)
    const products = await productManager.getProducts(limit, page, sort, query)
    console.log("viewsRouter", products, limit, page, sort)
        res.render('partials/products',{
            products,
            user
        }) 
})

// -------- Vista Home / Inicio
viewsRouter.get("/", publicAccess, async (req, res) => {

    const user = req.session.user;
    const products = await ProductModel.find().lean().exec()

    res.render("home", {
        title: "Home",
        product: products,
        user
    })
})

// -------- Vista de Real Time Products - Websocket
viewsRouter.get("/realTime", current(rol), async (req, res) => {
    const user = req.session.user;
    const products = await ProductModel.find().lean().exec()

    res.render("partials/realTimeProducts",{
        title: "Real Time",
        product: products,
        user
    })
})

// -------- Vista de WebChat - Websocket
viewsRouter.get("/chat", auth, passport.authenticate('jwt', {session: false}), async (req, res) => {

    res.render("partials/chat",{
        title: "Live Chat",
        user,
    })
})

// ------- Vista de informacion del producto
viewsRouter.get("/product/:pid", auth, passport.authenticate('jwt', {session: false}), async (req, res) => {
    const user = req.session.user;
    const { pid } = req.params;
    const product = await ProductModel.findById(pid).lean().exec()

    res.render("partials/product",{
        title: "Detalles",
        product: product,
        user
    })
})

// -------- Vista completa del carrito
viewsRouter.get("/cart/:cid", auth, passport.authenticate('jwt', {session: false}), async (req, res) => {

    const user = req.session.user;
    const { cid } = req.params;
    const cart = await CartModel.findById(cid).lean().exec()

    res.render("partials/cart",{
        title: "Cart",
        cart: cart,
        user
    })
})
    
export default viewsRouter