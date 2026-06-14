// Core dependencies and environment config
const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./routes/connection')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const dotenv = require('dotenv').config()
const rateLimit = require('express-rate-limit')
const seedDatabase = require('./seed.js') // Seeder for populating database

// Rate limiter: max 100 requests per second per IP
const limiter = rateLimit({ windowMs: 1000, max: 100 })

// Import route handlers
const authRoutes = require('./routes/auth')
const listingRoutes = require('./routes/listing')
const bookingRoutes = require('./routes/booking')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')

// CORS configuration for frontend/backend communication
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Allow frontend dev server
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}

// Global middleware
app.use(cors(corsOptions))                          // Enable CORS with credentials
app.use(cookieParser())                             // Parse cookies
app.use(express.json())                             // Parse incoming JSON
app.use(express.urlencoded({ extended: true }))     // Parse URL-encoded data
app.use(logger('dev'))                              // HTTP request logger
app.use(mongoSanitize())                            // Sanitize MongoDB operator injection
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })) // Relax CORS for Helmet
app.use(limiter)                                    // Apply rate limiting
app.use(express.static('public'))                   // Serve static files (e.g., images)

// Mount route handlers
app.use('/auth', authRoutes)                        // Authentication routes
app.use('/properties', listingRoutes)               // Listing/property routes
app.use('/bookings', bookingRoutes)                 // Booking routes
app.use('/users', userRoutes)                       // User routes (trips, wishlist, etc.)
app.use('/admin', adminRoutes)                     // Admin routes

// Handle running as a script or imported module
if (require.main === module) {
    // If run with `--seed`, connect DB and seed data
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
    } else {
        // Otherwise, start the server normally
        const PORT = process.env.PORT || 3001
        app.listen(PORT, async () => {
            await connectDB()
            console.log(`Server started on port ${PORT}`)
        })
    }
}

// Export for use in testing or other files
module.exports = app
