Review = require('../models/review')
const DBWrapper = require('./db')
var express = require('express')
var router = express.Router()

// gets the database wrapper to be used
// const db = new DBWrapper

// addReview()
router.post('/', async function(req, res, next) {
    console.log('POST addReview')
    const db = new DBWrapper
    console.log(db)
    const review = new Review(req.body.unitId, req.body.name, req.body.nameId, req.body.reviewText, req.body.rating, req.body.verified)
    const savedReview = await db.addReview(review)
    
    res.status(200).json(savedReview)
})

// TESTING THIS HAS SHOWN SOME PROBLEMS
// deleteReview()
router.delete('/review', async function (req, res, next) {
    const db = new DBWrapper
    // const review = new Review(req.body.unitId, req.body.name, req.body.nameId, req.body.reviewText, req.body.rating, req.body.verified)
    delReview = await db.deleteReview(req.body)
    if(delReview) {
        res.status(200).json({ message: "Review deleted Successfully" })
    } else {
        res.status(404).json({ message: "Review not found" })
    }
})

// getAllReviews() from dbWrapper
router.get('/', async function(req, res, next) {
    console.log('GET getAllReviews')
    const db = new DBWrapper
    var reviews = await db.getAllReviews()
    res.status(200).send(reviews)
})

// getReviewsByNameId()
router.get('/nameId', async function(req, res, next) {
    console.log('GET getReviewsByNameId')
    const db = new DBWrapper
    var reviews = await db.getReviewsByNameId(req.query.nameId)
    res.status(200).send(reviews)
})

// getReviewsByUnitId
router.get('/unitId', async function(req, res, next) {
    console.log('GET getReviewsByUnitId')
    const db = new DBWrapper
    var reviews = await db.getReviewsByUnitId(req.query.unitId)
    res.status(200).send(reviews)
})

// updateVerified()
// STILL NEED TO WRITE THIS FUNCTION

module.exports = router