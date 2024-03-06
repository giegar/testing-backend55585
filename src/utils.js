import path from "path"
import { fileURLToPath } from "url"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from './config/config.js'
import { sendEmail } from "./routes/email.routes.js"
import { getUser } from "./controllers/users.controller.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname;

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateToken =  (user) => {
    const token = jwt.sign({user}, config.jwtSecretKey, {expiresIn: '24h'})
    return token
}
export const tokenPassword = async (req, res) => {

    try {
        const { token } = req.query;
        const { email } = jwt.verify(token, config.jwtSecretKey)
        return res.json({ok:true, token, email})
    } catch {
        return res.status(401).json({ok:false, msg:'invalid token'})
    }
}
export const changePassword = async (req, res) => {
    
    try {
        const { token, password } = req.body;
        const { email } = jwt.verify(token, config.jwtSecretKey)

        const user = await getUser();
        if(email != user.email) return res.status(400).json({ok: false, msg:'invalid user'})

        user.password = createHash(password)
        user.save()

        return res.json({ok:true, msg:'Password changed successfully'})

    } catch {
        return res.status(500).json({ok:false, msg:'please contact us'})
    }
}
export const resetPassword = async (req, res) => {
   
    const { email } = req.body;
    const user = await getUser();
    if(email != user.email) return res.status(400).json({ok: false, msg:'invalid user'})

    const token = generateToken(user);
    const urlReset = `http://localhost:8080/reset-password?token=${token}`;

    await sendEmail(email, urlReset);

    return res.json({ok: true, msg:'email sent'})
}
