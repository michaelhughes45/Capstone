require("dotenv").config()
const mongoose = require('mongoose')
// tests connection to database
// only used as a 'Hello World'
const connectDB = async () => {
    try {
        const url = process.env.DB_URL
        await mongoose.connect(`${url}`)
        console.log('Connected to MongoDB')
        return
    } catch (error) {
        console.error('Error connecting to database: ', error)
        process.exit(1)
    }
}
module.exports = connectDB