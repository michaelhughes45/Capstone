Review = require('../models/review')
DBWrapper = require('./db')
var express = require('express')
var router = express.Router()

// gets the database wrapper to be used
const db = new DBWrapper

// getAllReviews() from dbWrapper
router.get('/', async function(req, res, next) {
    console.log('GET getAllReviews')
    var reviews = await db.getAllReviews()
    res.send(reviews)
})

// getReviewsByNameId()
router.get('/nameId', async function(req, res, next) {
    console.log('GET getReviewsByNameId')
    var reviews = await db.getReviewsByNameId(req.body.nameId)
    res.send(reviews)
})

// getReviewsByUnitId
router.get('/unitId', async function(req, res, next) {
    console.log('GET getReviewsByUnitId')
    var reviews = await db.getReviewsByUnitId(req.body.unitId)
    res.send(reviews)
})

// addReview()
router.post('/', async function(req, res, next) {
    console.log('POST addReview')
    const review = new Review(req.body.unitId, req.body.name, req.body.nameId, req.body.reviewText, req.body.rating)
    await db.addReview(review)

    res.send(JSON.stringify(review))
})

// THIS FUNCTION ISNT DONE YET
// deleteReview()
router.delete('/review', async function (req, res, next) {
    console.log('DELETE deleteReview()')
    const review = new Review(req.body.unitId, req.body.name, req.body.nameId, req.body.reviewText, req.body.rating)
    await db.deleteReview(review)
})

module.exports = router