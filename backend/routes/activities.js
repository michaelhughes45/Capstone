const Activity = require('../models/activity')
const DBWrapper = require('./db')
var express = require('express')
var router = express.Router()

// addActivity()
router.post('/', async function(req, res, next) {
    // console.log('POST addActivity')
    const db = new DBWrapper

    const { name, type, description, location, dateStart, dateEnd, hoursOpen } = req.body

    if (!name || !type || !description || !location || !hoursOpen) {
        return res.status(400).json({ message: "Missing required fields" })
    }

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

    if (!savedActivity) {
        return res.status(500).json({ message: "Failed to add activity" })
    }
    
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
    // console.log('GET getActivitiesByType')
    const db = new DBWrapper
    if (!req.query.type) {
        return res.status(400).json({ message: "Activity type is required" });
    }
    var activities = await db.getActivitiesByType(req.query.type)

    if (!activities || activities.length === 0) {
        return res.status(404).json({ message: "No activities found for this type" });
    }
    res.status(200).send(activities)
})

// getAllActivities()
router.get('/', async function(req, res, next) {
    // console.log('GET getAllActivities')
    const db = new DBWrapper
    var activities = await db.getAllActivities()

    if (!activities || activities.length === 0) {
        return res.status(404).json({ message: "No activities found" });
    }
    res.status(200).send(activities)
})

// updateActivity()
router.put('/activity', async function (req, res, next) {
    // console.log('PUT updateActivity')
    const db = new DBWrapper

    const { name, type, description, location, dateStart, dateEnd, hoursOpen } = req.body;
    if (!name || !type || !description || !location || !hoursOpen) {
        return res.status(400).json({ message: "Missing required fields for update" });
    }
    
    const updatedActivity = await db.updateActivity(req.body)

    if(!updatedActivity) {
        return res.status(404).json({ message: "Activity not found" })
    }
    res.status(200).json(updatedActivity)
})

module.exports = router