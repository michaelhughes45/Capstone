// Importing required modules and initializing the router
Stay = require('../models/stay') // Importing the Stay model
const DBWrapper = require('./db') // Importing the database wrapper for database operations
var express = require('express') // Importing Express.js
var router = express.Router() // Creating a new router instance

// addStay() - Adds a new stay to the database
router.post('/', async function(req, res, next) {
    const db = new DBWrapper
    const { personId, ownerId, unitId, startDate, endDate, paymentStatus, status } = req.body

    // Validate that all required fields are provided
    if (!personId || !ownerId || !unitId || !startDate || !endDate || !paymentStatus || !status) {
        return res.status(400).json({ message: "Missing required fields" })
    }

    // Create a new Stay object and save it to the database
    const stay = new Stay(req.body.personId, req.body.ownerId, req.body.unitId, req.body.startDate, req.body.endDate, req.body.dates, req.body.paymentStatus, req.body.status)
    const savedStay = await db.addStay(stay)
    
    // Respond with the saved stay
    res.status(200).json(savedStay)
})

// deleteStay() - Deletes a stay from the database
router.delete('/stay', async function (req, res, next) {
    const db = new DBWrapper
    deleteStay = await db.deleteStay(req.body)

    // Check if the stay was successfully deleted
    if(deleteStay) {
        res.status(200).json({ message: "Stay deleted Successfully" })
    } else {
        res.status(404).json({ message: "Stay not found" })
    }
})

// getAllStays() - Retrieves all stays from the database
router.get('/', async function(req, res, next) {
    const db = new DBWrapper
    var stays = await db.getAllStays()

    // Respond with the list of stays
    res.status(200).send(stays)
})

// getStaysByPaymentStatus() - Retrieves stays filtered by payment status
router.get('/paymentStatus', async function(req, res, next) {
    const db = new DBWrapper

    // Validate that the paymentStatus query parameter is provided
    if (!req.query.paymentStatus) {
        return res.status(400).json({ message: "Payment status is required" })
    }

    // Fetch stays with the specified payment status
    var stays = await db.getStaysByPaymentStatus(req.query.paymentStatus)

    // Check if any stays were found
    if (!stays || stays.length === 0) {
        return res.status(404).json({ message: "No stays found with this payment status" })
    }

    // Respond with the filtered stays
    res.status(200).send(stays)
})

// getStaysByOwnerId() - Retrieves stays filtered by owner ID
router.get('/ownerId', async function(req, res, next) {
    const db = new DBWrapper

    // Validate that the ownerId query parameter is provided
    if (!req.query.ownerId) {
        return res.status(400).json({ message: "Owner ID is required" })
    }

    // Fetch stays with the specified owner ID
    var stays = await db.getStaysByOwnerId(req.query.ownerId)

    // Check if any stays were found
    if (!stays || stays.length === 0) {
        return res.status(404).json({ message: "No stays found for this owner" })
    }

    // Respond with the filtered stays
    res.status(200).send(stays)
})

// getStaysByPersonId() - Retrieves stays filtered by person ID
router.get('/personId', async function(req, res, next) {
    const db = new DBWrapper

    // Validate that the personId query parameter is provided
    if (!req.query.personId) {
        return res.status(400).json({ message: "Person ID is required" })
    }
    
    // Fetch stays with the specified person ID
    var stays = await db.getStaysByPersonId(req.query.personId)

    // Check if any stays were found
    if (!stays || stays.length === 0) {
        return res.status(404).json({ message: "No stays found for this person" })
    }

    // Respond with the filtered stays
    res.status(200).send(stays)
})

// getStaysByUnitId() - Retrieves stays filtered by unit ID
router.get('/unitId', async function(req, res, next) {
    const db = new DBWrapper

    // Validate that the unitId query parameter is provided
    if (!req.query.unitId) {
        return res.status(400).json({ message: "Unit ID is required" })
    }

    // Fetch stays with the specified unit ID
    var stays = await db.getStaysByUnitId(req.query.unitId)

    // Check if any stays were found
    if (!stays || stays.length === 0) {
        return res.status(404).json({ message: "No stays found for this unit" })
    }

    // Respond with the filtered stays
    res.status(200).send(stays)
})

// updateStay() - Updates an existing stay in the database
router.put('/stay', async function (req, res, next) {
    const db = new DBWrapper
    const { _id, personId, ownerId, unitId, startDate, endDate, dates, paymentStatus, status } = req.body

    // Validate that all required fields are provided
    if (!_id || !personId || !ownerId || !unitId || !startDate || !endDate || !dates || !paymentStatus || !status) {
        return res.status(400).json({ message: "Missing required fields for update" }) 
    }

    // Update the stay in the database
    const updatedStay = await db.updateStay(req.body)

    // Check if the stay was successfully updated
    if(!updatedStay) {
        return res.status(404).json({ message: "Stay not found" })
    }

    // Respond with the updated stay
    res.status(200).json(updatedStay)
})

// Export the router to be used in other parts of the application
module.exports = router