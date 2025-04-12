const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./routes/connection')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const dotenv = require('dotenv').config()
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }) // 100 requests per 15 minutes

// import routes
const authRoutes = require('./routes/auth')
const listingRoutes = require('./routes/listing')
const bookingRoutes = require('./routes/booking')
const userRoutes = require('./routes/user')

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}

// middleware
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
// app.use(express.urlencoded({extended: false}))
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))
app.use(mongoSanitize())
// causes error I have this error: net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin
// app.use(helmet())
// correct way, does not error
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(limiter)
app.use(express.static('public'))


// routes
app.use('/auth', authRoutes)
app.use('/properties', listingRoutes)
app.use('/bookings', bookingRoutes)
app.use('/users', userRoutes)


// // this is only to test if frontend can recieve information from backend
// app.get("/api", (req, res) => {
//     res.json({"value": "Condo Rentals"})
// })

if (require.main === module) {
    const PORT = 3001
    app.listen(PORT, async () => {
        connectDB()
        console.log(`Server started on port ${PORT}`)
    });
}

module.exports = app