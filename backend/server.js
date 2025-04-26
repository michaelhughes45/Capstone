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
const limiter = rateLimit({ windowMs: 1000, max: 100 }) // 100 requests per second
const seedDatabase = require('./seed.js')

// import routes
const authRoutes = require('./routes/auth')
const listingRoutes = require('./routes/listing')
const bookingRoutes = require('./routes/booking')
const userRoutes = require('./routes/user')

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}

// middleware
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))
app.use(mongoSanitize())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(limiter)
app.use(express.static('public'))


// routes
app.use('/auth', authRoutes)
app.use('/properties', listingRoutes)
app.use('/bookings', bookingRoutes)
app.use('/users', userRoutes)


if (require.main === module) {
    if (process.argv.includes('--seed')) {
        (async () => { 
            try {
                await connectDB()
                console.log('✅ MongoDB connected...')
                await seedDatabase()
                console.log('✅ Database seeded...')
                process.exit(0)
            } catch (error) {
                console.error('❌ MongoDB connection failed:', error)
                process.exit(1)
            }
        })()
    }
    else {
        const PORT = 3001
        app.listen(PORT, async () => {
            await connectDB()
            console.log(`Server started on port ${PORT}`)
        });
    }
}

module.exports = app