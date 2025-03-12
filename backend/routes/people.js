Person = require('../models/person')
const DBWrapper = require('./db')
var express = require('express')
var router = express.Router()

// addPerson()
router.post('/', async function(req, res, next) {
    console.log('POST addPerson')
    const db = new DBWrapper
    const person = new Person(req.body.name, req.body.username, req.body.password, req.body.type, req.body.unitsStayedIn, req.body.unitsOwned)
    const savedPerson = await db.addPerson(person)
    
    res.status(200).json(savedPerson)
})

// deletePerson()
router.delete('/person', async function (req, res, next) {
    console.log('DELETE deletePerson')
    const db = new DBWrapper
    deletePerson = await db.deletePerson(req.body)
    if(deletePerson) {
        res.status(200).json({ message: "Person deleted Successfully" })
    } else {
        res.status(404).json({ message: "Person not found" })
    }
})

// getAllPeople()
router.get('/', async function(req, res, next) {
    console.log('GET getAllPeople')
    const db = new DBWrapper
    var people = await db.getAllPeople()
    res.status(200).send(people)
})

// getPersonById()
router.get('/id', async function(req, res, next) {
    console.log('GET getPersonById')
    const db = new DBWrapper
    var person = await db.getPersonById(req.query._id)
    res.status(200).send(person)
})

// getPersonByUsername()
router.get('/username', async function(req, res, next) {
    console.log('GET getPersonByUsername')
    const db = new DBWrapper
    var person = await db.getPersonByUsername(req.query.username)
    res.status(200).send(person)
})

// getUnitsOwned()
router.get('/unitsOwned', async function(req, res, next) {
    console.log('GET getUnitsOwned')
    const db = new DBWrapper
    var units = await db.getUnitsOwned(req.query.username)
    res.status(200).send(units)
})

// getUnitsStayedIn()
router.get('/unitsStayedIn', async function(req, res, next) {
    console.log('GET getUnitsStayedIn')
    const db = new DBWrapper
    var units = await db.getUnitsStayedIn(req.query.username)
    res.status(200).send(units)
})

// updatePerson()
router.put('/person', async function (req, res, next) {
    console.log('PUT updatePerson')
    const db = new DBWrapper
    const updatedPerson = await db.updatePerson(req.body)

    if(!updatedperson) {
        return res.status(400).json({ message: "Person not found" })
    }
    res.status(200).json(updatedPerson)
})