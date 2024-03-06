export const current = (rol) => {
    return (req,res,next) => {
        if(req.user.rol == rol) {
            return next()
        }

        res.status(400).send("no autorizado")
    }
}

export const publicAccess = (req, res, next) => {
    if(req.cookies['CoderCookie']) return res.redirect('/products')
    
    return next()
}

export const auth = (req, res, next) => {
    if(req.cookies['CoderCookie']) return next()
    res.redirect('/login')
}