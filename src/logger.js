import winston from 'winston'

const customLevelOption = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5 
    }
}

const devLogger = winston.createLogger({
    levels: customLevelOption.levels,
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ]
})
const prodLogger = winston.createLogger({
    levels: customLevelOption.levels,
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: './errors.log', level: 'error' })
    ]
})

export const addDevLogger = (req, res, next) => {

    req.devlogger = devLogger
    req.devlogger.info = (`devLogger: [${req.method}] - ${req.url} - ${new Date().toLocaleDateString}`)
    next()

}
export const addProdLogger = (req, res, next) => {
    
    req.prodlogger = prodLogger
    req.prodlogger.info = (`prodLogger: [${req.method}] - ${req.url} - ${new Date().toLocaleDateString}`)
    next()

}
