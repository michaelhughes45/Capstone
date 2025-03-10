Activity = require('../models/activity')

const Activity = require('../models/activity')
const DBWrapper = require('./db')
var express = require('express')
var router = express.Router()

// addActivity()
router.post('/', async function(req, res, next) {
    console.log('POST addActivity')
    const db = new DBWrapper
    const activity = new Activity(req.body.name, req.body.type, req.body.description, req.body.location, req.body.dateStart, req.body.dateEnd, req.body.hoursOpen)
    const savedActivity = await db.addActivity(activity)
    
    res.status(200).json(savedActivity)
})

// deleteActivity()

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
// NEED TO BE IMPLEMENTED
