Review = require('../models/review')
const DBWrapper = require('./db')
var express = require('express')
var router = express.Router()

// gets the database wrapper to be used
// const db = new DBWrapper

// addReview()
router.post('/', async function(req, res, next) {
    // console.log('POST addReview')
    const db = new DBWrapper
    const { unitId, name, nameId, reviewText, rating, verified } = req.body;

    // ✅ Validate required fields
    if (!unitId || !name || !nameId || !reviewText || rating === undefined || verified === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
    }

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
    // console.log('GET getAllReviews')
    const db = new DBWrapper
    var reviews = await db.getAllReviews()
    res.status(200).send(reviews)
})

// getReviewsByNameId()
router.get('/nameId', async function(req, res, next) {
    // console.log('GET getReviewsByNameId')
    const db = new DBWrapper
    if (!req.query.nameId) {
        return res.status(400).json({ message: "nameId is required" });
    }

    var reviews = await db.getReviewsByNameId(req.query.nameId)

    if (!reviews || reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for this nameId" });
    }

    res.status(200).send(reviews)
})

// getReviewsByUnitId
router.get('/unitId', async function(req, res, next) {
    // console.log('GET getReviewsByUnitId')
    const db = new DBWrapper
    if (!req.query.unitId) {
        return res.status(400).json({ message: "unitId is required" });
    }

    var reviews = await db.getReviewsByUnitId(req.query.unitId)

    if (!reviews || reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for this unitId" });
    }

    res.status(200).send(reviews)
})

// updateReview()
// STILL NEED TO WRITE THIS FUNCTION
router.put('/review', async function (req, res, next) {
    // console.log('PUT updateReview')
    const db = new DBWrapper

    const { _id, reviewText, rating, verified } = req.body;

    // ✅ Validate required fields
    if (!_id || !reviewText || rating === undefined || verified === undefined) {
        return res.status(400).json({ message: "Missing required fields for update" });
    }

    const updatedReview = await db.updateReview(req.body)

    if(!updatedReview) {
        return res.status(404).json({ message: "Review not found" })
    }
    res.status(200).json(updatedReview)
})

module.exports = router