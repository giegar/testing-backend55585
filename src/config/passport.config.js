import UserModel from "../dao/models/users.model.js";
import { addCart } from "../controllers/carts.controller.js";
import {createHash, isValidPassword} from '../utils.js'
import { generateToken } from '../utils.js'

import passport from "passport";
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import passportJWT from 'passport-jwt'

import config from "./config.js";

const JWTStrategy = passportJWT.Strategy
const localStrategy = local.Strategy

const cookieExtractor = req => {
    const token = (req?.cookies) ? req.cookies['CoderCookie'] : null

    console.log ('COOKIE EXTRACTOR: ', token)

    return token
}

const initializePassport = () => {

// ----- LOCAL STRATEGY WITH JWT -> Register, Login
passport.use('register', new localStrategy({
    passReqToCallback: true,
    usernameField: 'email'
}, async (req, email, password, done) => {
    const {name, lastname, age} = req.body
    try {
        const user = await UserModel.findOne({email: email})
        if(user){
            console.log("User already exists")
            return done(null, false)
        }

        const cart = await addCart();

        const newUser = {
            name,
            lastname,
            email,
            age,
            rol: "user",
            cartId: cart.res._id,
            password: createHash(password)
        }

        const result = await UserModel.create(newUser)
        return done(null, result)

    } catch (error) {
        done('Passport error to register: ' + error)
    }
}))

passport.use('login', new localStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {

        const user = await UserModel.findOne({email:email}).lean().exec()

        if(!user){
            console.log('User doesnt exist')
            return done(null, false)
        }

        if(!isValidPassword(user, password)){
            console.log('Incorrect password')
            return done(null, false)
        }

        const token = generateToken(user)
        user.token = token

        return done(null, user)
    } catch (error) {
        return done('Passport error to login' + error)
    }
}))

passport.use('jwt', new JWTStrategy({
    secretOrKey: config.jwtSecretKey,
    jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([cookieExtractor])
}, (jwt_payload, done) => {
    return done(null, jwt_payload)
}))

// ----- GITHUB STRATEGY -> Register, Login
    passport.use('github', new GitHubStrategy({
        clientID: config.githubId,
        clientSecret: config.githubSecret,
        callbackURL: 'http://localhost:8080/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {

            try{
                const user = await UserModel.findOne({email: profile._json.email})

                if (user) {

                    console.log('already registered')
                    return done(null, user)
                }

                const newUser = await UserModel.create({
                    name: profile._json.name,
                    lastname: '',
                    email: profile._json.email,
                    password: ''
                })

                return done(null, newUser)
            } catch {
                return done ('error to login with github' + error)
            }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport