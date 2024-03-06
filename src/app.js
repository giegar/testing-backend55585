import express from "express";
import session from "express-session";
import { engine } from "express-handlebars";

import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

import { Server } from "socket.io";

import mongoose from "mongoose";
import MongoStore from "connect-mongo";

import * as path from "path";
import __dirname from "./utils.js";

import viewsRouter from "./routes/views.routes.js";
import cartRouter from "./routes/carts.routes.js";
import productRouter from "./routes/products.routes.js";
import sessionRouter from "./routes/session.routes.js";
import emailRouter from "./routes/email.routes.js";
import UserRouter from "./routes/user.routes.js";

import cookieParser from "cookie-parser";
import MsgModel from "./dao/models/message.model.js";

import initializePassport from "./config/passport.config.js";
import passport from "passport";

import config from './config/config.js'

import { addDevLogger, addProdLogger } from "./logger.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/public"))

// --------- SWAGGER

const swaggerOptions = {
    definition: {
        openapi:'3.1.0',
        info: 'Documentacion de API E-Commerce',
        description:'Proyecto E-Commerce de Coderhouse'
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const spec = swaggerJsdoc(swaggerOptions)

// -------- HANDLEBARS CONFIG

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

// ------ SESSIONS

const sessionStore = MongoStore.create({
    mongoUrl: config.mongoURL,
    dbName: config.mongoDBName
})

app.use(session({
    store: sessionStore,
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(cookieParser())

initializePassport();
app.use(passport.initialize())
app.use(passport.session())

// ------- ROUTES

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/sessions", sessionRouter)
app.use("/", emailRouter)
app.use("/", viewsRouter)
app.use('/api/user', UserRouter)
app.use('/docs-api', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))

// ---- Endpoint Prod y Dev Logger Test con Winston

app.use(addDevLogger)
app.use(addProdLogger)

app.get('/loggerTest', (req, res) => {
    req.devlogger.debug('DEV debug')
    //req.devLogger.http('DEV http')
    //req.devLogger.info('DEV info')
    //req.devLogger.warning('DEV warning')
    //req.devLogger.error('DEV error')
    //req.devLogger.fatal('DEV fatal')

    //req.prodlogger.info('PROD info')
    req.prodlogger.warning('PROD warning')
    req.prodlogger.error('PROD error')
    req.prodlogger.fatal('PROD fatal')
})

// ------ MONGO DB CONNECT

mongoose.connect(config.mongoURL, {dbName: config.mongoDBName})
    .then(() => {
        console.log("DataBase connected")
    })
    .catch(e => {
        console.error("Error connecting to DataBase")
    })

// --------- LISTEN SERVER

const httpServer = app.listen(config.port, () => { console.log(`Server in port ${config.port}`)})
const socketServer = new Server(httpServer)

// -------- WEBSOCKETS

socketServer.on('connection', async (socket) => {
    console.log('New client connected')
    
    // REAL TIME PRODUCTS
    socket.on('newProduct', data =>{
        socketServer.emit('refreshProducts', data)
    }); 
    
    // CHAT
    const messages = await MsgModel.find();
    socket.emit('logs', messages)

    socket.on('message', async (data) =>{
        const saveMsg = await MsgModel.create({...data})
        if (saveMsg){
            const refresh = await MsgModel.find();
            socketServer.emit('logs', refresh)}
    });
})



