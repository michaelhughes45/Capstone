Stay = require('../models/stay')
const DBWrapper = require('./db')
var express = require('express')
var router = express.Router()

// addStay()
router.post('/', async function(req, res, next) {
    // console.log('POST addStay')
    const db = new DBWrapper
    const { personId, ownerId, unitId, startDate, endDate, paymentStatus, status } = req.body

    if (!personId || !ownerId || !unitId || !startDate || !endDate || !paymentStatus || !status) {
        return res.status(400).json({ message: "Missing required fields" })
    }

    const stay = new Stay(req.body.personId, req.body.ownerId, req.body.unitId, req.body.startDate, req.body.endDate, req.body.dates, req.body.paymentStatus, req.body.status)
    const savedStay = await db.addStay(stay)
    
    res.status(200).json(savedStay)
})

// deleteStay()
router.delete('/stay', async function (req, res, next) {
    // console.log('DELETE deleteStay')
    const db = new DBWrapper
    deleteStay = await db.deleteStay(req.body)
    if(deleteStay) {
        res.status(200).json({ message: "Stay deleted Successfully" })
    } else {
        res.status(404).json({ message: "Stay not found" })
    }
})

// getAllStays()
router.get('/', async function(req, res, next) {
    // console.log('GET getAllStays')
    const db = new DBWrapper
    var stays = await db.getAllStays()
    res.status(200).send(stays)
})

// getStaysByPaymentStatus()
router.get('/paymentStatus', async function(req, res, next) {
    // console.log('GET getStaysByPaymentStatus')
    const db = new DBWrapper
    if (!req.query.paymentStatus) {
        return res.status(400).json({ message: "Payment status is required" })
    }

    var stays = await db.getStaysByPaymentStatus(req.query.paymentStatus)

    if (!stays || stays.length === 0) {
        return res.status(404).json({ message: "No stays found with this payment status" })
    }
    res.status(200).send(stays)
})

// getStaysByOnwerId()
router.get('/ownerId', async function(req, res, next) {
    // console.log('GET getStaysByOwnerId')
    const db = new DBWrapper

    if (!req.query.ownerId) {
        return res.status(400).json({ message: "Owner ID is required" })
    }

    var stays = await db.getStaysByOwnerId(req.query.ownerId)

    if (!stays || stays.length === 0) {
        return res.status(404).json({ message: "No stays found for this owner" })
    }

    res.status(200).send(stays)
})

// getStaysByPersonId()
router.get('/personId', async function(req, res, next) {
    // console.log('GET getStaysByPersonId')
    const db = new DBWrapper

    if (!req.query.personId) {
        return res.status(400).json({ message: "Person ID is required" })
    }
    
    var stays = await db.getStaysByPersonId(req.query.personId)

    if (!stays || stays.length === 0) {
        return res.status(404).json({ message: "No stays found for this person" })
    }
    res.status(200).send(stays)
})

// getStaysByUnitId()
router.get('/unitId', async function(req, res, next) {
    // console.log('GET getStaysByUnitId')
    const db = new DBWrapper

    if (!req.query.unitId) {
        return res.status(400).json({ message: "Unit ID is required" })
    }

    var stays = await db.getStaysByUnitId(req.query.unitId)

    if (!stays || stays.length === 0) {
        return res.status(404).json({ message: "No stays found for this unit" })
    }
    res.status(200).send(stays)
})

// updateStay()
router.put('/stay', async function (req, res, next) {
    // console.log('PUT updateStay')
    const db = new DBWrapper
    const { _id, personId, ownerId, unitId, startDate, endDate, dates, paymentStatus, status } = req.body

    // Check if all required fields are present
    if (!_id || !personId || !ownerId || !unitId || !startDate || !endDate || !dates || !paymentStatus || !status) {
        return res.status(400).json({ message: "Missing required fields for update" }) 
    }

    const updatedStay = await db.updateStay(req.body)

    if(!updatedStay) {
        return res.status(404).json({ message: "Stay not found" })
    }
    res.status(200).json(updatedStay)
})

module.exports = router