const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./routes/db')

const corsOptions = {
    origin: "http://localhost:5173",
}

app.use(cors())

app.get("/api", (req, res) => {
    res.json({"value": "Condo Rentals"})

})

if (require.main === module) {
    const PORT = 8080;
    app.listen(PORT, async () => {
        connectDB()
        console.log(`Server started on port ${PORT}`);
    });
}

module.exports = app