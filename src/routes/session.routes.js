import { Router } from "express";
import passport from "passport";
import UserModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";

const sessionRouter = Router()

sessionRouter.get('/error', async (req, res) => {
    res.send('Error')
})

sessionRouter.post('/register', passport.authenticate('register', {failureRedirect: '/home', session: false}), async (req, res) => {
    
   const { name, lastname, email, age, password, confirmPassword } = req.body
    if (!name || !lastname || !email || !age || !password || !confirmPassword)
    return res.status(400).json({ status: 'error', message: 'error register'})

    if (password !== confirmPassword) return res.send("Passwords must match")

    let user = {
        name,
        lastname,
        email,
        age,
        password: createHash(password)
    }

    const existUser = await UserModel.findOne({ email: user.email })

    if (existUser) return res.json({ status: 'error', message: 'email is already registered' })

    await UserModel.create(user)
    req.session.user = user
    res.redirect('/products')
})

sessionRouter.post('/login', passport.authenticate('login', {failureRedirect: '/home', session:false}), async (req, res) => {
    if(!req.user) return res.status(404).send("Invalid credentials")
        
    const {token} = req.user

    res.cookie('CoderCookie', token, {
        maxAge: 60 * 60 * 1000,
        httpOnly:true
    }).redirect('/products')

})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('Logout error')

        return res.redirect('/')
    })
})

// ------- GITHUB SESSIONS

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }),
    async (req, res) => { }
)

sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/error'}),
        (req, res) => {
        console.log('callback: ', req.user)
        
        req.session.user = req.user
        console.log('User session setted')

        res.redirect('/products')
})


export default sessionRouter; 



