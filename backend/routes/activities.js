const Activity = require('../models/activity')
const DBWrapper = require('./db')
var express = require('express')
var router = express.Router()

// addActivity()
router.post('/', async function(req, res, next) {
    console.log('POST addActivity')
    const db = new DBWrapper
    const activity = {
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        location: req.body.location,
        dateStart: req.body.dateStart || null,
        dateEnd: req.body.dateEnd || null,
        hoursOpen: req.body.hoursOpen
    }
    // const activity = new Activity(req.body.name, req.body.type, req.body.description, req.body.location, req.body.dateStart || null, req.body.dateEnd || null, req.body.hoursOpen)
    const savedActivity = await db.addActivity(activity)
    
    res.status(200).json(savedActivity)
})

// deleteActivity()
router.delete('/activity', async function (req, res, next) {
    const db = new DBWrapper
    delActivity = await db.deleteActivity(req.body)
    if(delActivity) {
        res.status(200).json({ message: "Activity deleted Successfully" })
    } else {
        res.status(404).json({ message: "Activity not found" })
    }
})

// getActivitiesByType()
router.get('/type', async function(req, res, next) {
    console.log('GET getActivitiesByType')
    const db = new DBWrapper
    var activites = await db.getActivitiesByType(req.query.type)
    res.status(200).send(activites)
})

// getAllActivities()
router.get('/', async function(req, res, next) {
    console.log('GET getAllActivities')
    const db = new DBWrapper
    var activites = await db.getAllActivities()
    res.status(200).send(activites)
})

// updateActivity()
router.put('/activity', async function (req, res, next) {
    console.log('PUT updateActivity')
    const db = new DBWrapper
    const updatedActivity = await db.updateActivity(req.body)

    if(!updatedActivity) {
        return res.status(400).json({ message: "Activity not found" })
    }
    res.status(200).json(updatedActivity)
})

module.exports = router