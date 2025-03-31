const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./routes/connection')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }) // 100 requests per 15 minutes
app.use(limiter)

var reviewsRouter = require('./routes/reviews')
var activitiesRouter = require('./routes/activities')
var peopleRouter = require('./routes/people')
var staysRouter = require('./routes/stays')
var picturesRouter = require('./routes/pictures')
var unitsRouter = require('./routes/units')

const corsOptions = {
    origin: "http://localhost:5173",
}

// middleware
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(logger('dev'))
app.use(mongoSanitize())
app.use(helmet())
app.use(limiter)


// routes
app.use('/reviews', reviewsRouter)
app.use('/activities', activitiesRouter)
app.use('/people', peopleRouter)
app.use('/stays', staysRouter)
app.use('/pictures', picturesRouter)
app.use('/units', unitsRouter)


// this is only to test if frontend can recieve information from backend
app.get("/api", (req, res) => {
    res.json({"value": "Condo Rentals"})

})

if (require.main === module) {
    const PORT = 8080
    app.listen(PORT, async () => {
        connectDB()
        console.log(`Server started on port ${PORT}`)
    });
}

module.exports = app