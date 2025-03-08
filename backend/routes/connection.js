require("dotenv").config()
const mongoose = require('mongoose')
// tests connection to database
// only used as a 'Hello World'
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URL}`)
        console.log('Connected to MongoDB')

    } catch (error) {
        console.error('Error connecting to database: ', error)
        process.exit(1)
    }
}
module.exports = connectDB