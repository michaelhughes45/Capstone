// Import the Review model, which represents reviews in the database
const Review = require('../models/review');

// Import the database wrapper that handles database operations
const DBWrapper = require('./db');

// Import Express to create and manage routes
var express = require('express');
var router = express.Router();

/**
 * @route POST /
 * @desc Adds a new review to the database
 * @access Public
 */
router.post('/', async function(req, res, next) {
    // Create a new instance of the database wrapper
    const db = new DBWrapper();

    // Extract review data from the request body
    const { unitId, name, nameId, reviewText, rating, verified } = req.body;

    // ✅ Validate required fields before proceeding
    if (!unitId || !name || !nameId || !reviewText || rating === undefined || verified === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new Review object using the provided data
    const review = new Review(unitId, name, nameId, reviewText, rating, verified);

    // Save the review in the database
    const savedReview = await db.addReview(review);

    // Respond with the saved review data
    res.status(200).json(savedReview);
});

/**
 * @route DELETE /review
 * @desc Deletes a review from the database
 * @access Public
 */
router.delete('/review', async function (req, res, next) {
    const db = new DBWrapper();

    // Delete the review based on the request body data
    const delReview = await db.deleteReview(req.body);

    // If the review was found and deleted, send success response
    if (delReview) {
        res.status(200).json({ message: "Review deleted successfully" });
    } else {
        // If review was not found, send a 404 response
        res.status(404).json({ message: "Review not found" });
    }
});

/**
 * @route GET /
 * @desc Retrieves all reviews from the database
 * @access Public
 */
router.get('/', async function(req, res, next) {
    const db = new DBWrapper();

    // Fetch all reviews from the database
    const reviews = await db.getAllReviews();

    // Send the retrieved reviews as the response
    res.status(200).send(reviews);
});

/**
 * @route GET /nameId
 * @desc Retrieves reviews based on nameId
 * @access Public
 */
router.get('/nameId', async function(req, res, next) {
    const db = new DBWrapper();

    // Validate that nameId is provided in the query parameters
    if (!req.query.nameId) {
        return res.status(400).json({ message: "nameId is required" });
    }

    // Fetch reviews associated with the given nameId
    const reviews = await db.getReviewsByNameId(req.query.nameId);

    // If no reviews are found, return a 404 response
    if (!reviews || reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for this nameId" });
    }

    // Send the retrieved reviews as the response
    res.status(200).send(reviews);
});

/**
 * @route GET /unitId
 * @desc Retrieves reviews based on unitId
 * @access Public
 */
router.get('/unitId', async function(req, res, next) {
    const db = new DBWrapper();

    // Validate that unitId is provided in the query parameters
    if (!req.query.unitId) {
        return res.status(400).json({ message: "unitId is required" });
    }

    // Fetch reviews associated with the given unitId
    const reviews = await db.getReviewsByUnitId(req.query.unitId);

    // If no reviews are found, return a 404 response
    if (!reviews || reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for this unitId" });
    }

    // Send the retrieved reviews as the response
    res.status(200).send(reviews);
});

/**
 * @route PUT /review
 * @desc Updates an existing review in the database
 * @access Public
 */
router.put('/review', async function (req, res, next) {
    const db = new DBWrapper();

    // Extract required fields from the request body
    const { _id, reviewText, rating, verified } = req.body;

    // ✅ Validate required fields before proceeding
    if (!_id || !reviewText || rating === undefined || verified === undefined) {
        return res.status(400).json({ message: "Missing required fields for update" });
    }

    // Attempt to update the review in the database
    const updatedReview = await db.updateReview(req.body);

    // If review was not found, return a 404 response
    if (!updatedReview) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Send the updated review as the response
    res.status(200).json(updatedReview);
});

// Export the router to be used in other parts of the application
module.exports = router;
