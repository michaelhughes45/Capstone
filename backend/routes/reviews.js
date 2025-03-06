Review = require('../models/review')
DBWrapper = require('./db')
var express = require('express')
var router = express.Router()

const db = new DBWrapper

router.get('/', async function(req, res, next) {
    console.log('router.get::reviews/ GET')
    var reviews = await db.getAllReviews()
    res.send(reviews)
})


router.post('/', async function(req, res, next) {
    console.log('router.post::reviews/ POST')
    const review = new Review(req.body.unitId, req.body.address, req.body.unitNumber, req.body.name, req.body.reviewText, req.body.rating)
    await db.addReview(review)

    res.send(JSON.stringify(review))
})

module.exports = router