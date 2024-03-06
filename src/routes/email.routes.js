import express from "express";
import nodemailer from 'nodemailer';
import config from "../config/config.js";
import { changePassword, tokenPassword } from "../utils.js";

const emailRouter = express.Router();

const transport = nodemailer.createTransport({
    service: config.emailService,
    port: config.emailPort,
    auth: {
        user: config.googleAppUser,
        pass: config.googleAppPass
    }
})
export const sendEmail = async (email, url) => {
    try{

        await transport.sendMail({
            from: `E-Commerce <${config.googleAppUser}>`,
            to: `${email}`,
            subject: 'Reset password',
            html: templateHtmlEmail(email, url)
        })

    } catch(error){
        console.log(error)
    }
}
//emailRouter.get('/reset-password', [], tokenPassword)
//emailRouter.post('/reset-password', [], changePassword)

const templateHtmlEmail = (email, url) =>{
    const title = 'Reset your password on Ecommerce'
    const link = url;
    return (
        `
            <div>
                <div>
                    <h1>${title}</h1>
                        p>Someone is trying to log in with ${email}</p>
                </div>
                
                <div>
                    <h3>Click on the link below if you want to change your password</h3>
                        <p>Remember it will expire in 24hs</p>
                </div>
                    
                <div>
                    <div>
                        <a href='${link}'> <h4>Reset password<h4> </a>  
                    </div>

                    <p>If this request did not come from you just ignore this email</p>
                </div>
            </div>
        `
    )
}
emailRouter.get('/email', async (req, res) => {

    const result = await transport.sendMail({
        from: `E-Commerce <${config.googleAppUser}>`,
        to: config.googleAppUser,
        subject: 'Welcome!',
        html:`
            <div>
                <h1>Welcome to our Community</h1>
                <h3>We have a little gift for you</h3>
                <div>
                <h4>25% OFF in our E-Commerce<h4>
                </div>
            </div>
        `  
    })
    console.log(result)
    res.send('email sent')  
})


export default emailRouter