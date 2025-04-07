const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const cors = require('cors')

// Import routes
const authRoutes = require('./routes/auth')
const listingRoutes = require('./routes/listing')
const bookingRoutes = require('./routes/booking')
const userRoutes = require('./routes/user')

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

// Routes
app.use('/auth', authRoutes)
app.use('/properties', listingRoutes)
app.use('/bookings', bookingRoutes)
app.use('/users', userRoutes)


// Connect to MongoDB and start the server
const PORT = 3001
mongoose.connect(process.env.MONGO_URL, {dbName: 'Dream_Nest'}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch((err) => {
    console.log(`${err} did not connect`)
})