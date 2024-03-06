import dotenv from 'dotenv'

dotenv.config()

export default {
    port: process.env.PORT ,

    mongoURL: process.env.MONGO_URL,
    mongoDBName: process.env.MONGO_DB_NAME,

    githubId: process.env.GITHUB_CLIENT_ID,
    githubSecret: process.env.GITHUB_CLIENT_SECRET,
    
    emailService: process.env.EMAIL_SERVICE,
    emailPort:process.env.EMAIL_PORT,
    googleAppPass: process.env.GOOGLE_PASSWORD,
    googleAppUser: process.env.GOOGLE_USER,

    jwtSecretKey: process.env.SECRET_KEY_JWT
}