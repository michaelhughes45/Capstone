Review = require('../models/review')
const DBWrapper = require('./db')
var express = require('express')
var router = express.Router()

// gets the database wrapper to be used
// const db = new DBWrapper
// console.log('Using mock DBWrapper:', db);

// getAllReviews() from dbWrapper
router.get('/', async function(req, res, next) {
    console.log('GET getAllReviews')
    const db = new DBWrapper
    var reviews = await db.getAllReviews()
    res.status(200).send(reviews)
})

// getReviewsByNameId()
router.get('/nameId', async function(req, res, next) {
    console.log('GET getReviewsByNameId', req.query.nameId)
    const db = new DBWrapper
    var reviews = await db.getReviewsByNameId(req.query.nameId)
    res.status(200).send(reviews)
})

// getReviewsByUnitId
router.get('/unitId', async function(req, res, next) {
    console.log('GET getReviewsByUnitId', req.query.unitId)
    const db = new DBWrapper
    var reviews = await db.getReviewsByUnitId(req.query.unitId)
    res.status(200).send(reviews)
})

// addReview()
router.post('/', async function(req, res, next) {
    console.log('POST addReview', req.body)
    const db = new DBWrapper
    const review = new Review(req.body.unitId, req.body.name, req.body.nameId, req.body.reviewText, req.body.rating, req.body.verified)
    const savedReview = await db.addReview(review)
    console.log('Saved Review:', savedReview)
    // res.status(200).send(review)
    res.status(200).json(savedReview)
})

// updateVerified()
// STILL NEED TO WRITE THIS FUNCTION

// TESTING THIS HAS SHOWN SOME PROBLEMS
// deleteReview()
router.delete('/review', async function (req, res, next) {
    console.log('DELETE deleteReview()', req.body)
    const db = new DBWrapper
    // const review = new Review(req.body.unitId, req.body.name, req.body.nameId, req.body.reviewText, req.body.rating, req.body.verified)
    delReview = await db.deleteReview(req.body)
    console.log('deleted Review:', delReview)
    if(delReview) {
        res.status(200).json({ message: "Review deleted Successfully" })
    } else {
        res.status(404).json({ message: "Review not found" })
    }
})

module.exports = router