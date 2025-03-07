require("dotenv").config()
const Review = require('../models/review')

const mongoose = require('mongoose')

// Connect to the mongoDB database, throws error if it fails
try {
    await mongoose.connect(`${process.env.DB_URL}`)
    console.log('Connected to MongoDB')

} catch (error) {
    console.error('Error connecting to database: ', error)
    process.exit(1)
}

// schemas

// Review Schema
// defines the Review object
const ReviewSchema = mongoose.Schema(
    {
        unitId: { type: String, required: true },
        name: { type: String, required: true },
        nameId: { type: String, required: true },
        reviewText: { type: String, required: true },
        rating: { type: Number, required: true },
    }
)
const ReviewModel = mongoose.model('reviews', ReviewSchema)


// tests connection to database
// only used as a 'Hello World'
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URL}`)
        console.log('Connected to MongoDB')

    } catch (error) {
        console.error('Error connecting to database: ', error)
        process.exit(1)
    }
}
module.exports = connectDB

module.exports = class DBWrapper {
    constructor() {

    }

    // Review functions

    // addReview
    // adds the given review to the database
    async addReview(review) {
        const mongoDBReview = new ReviewModel(review)
        await mongoDBReview.save()
        review._id = mongoDBReview._id
        return review
    }

    // deleteReview()
    // deletes a review from the database
    async deleteReview(review) {
        const deletedReview = await ReviewModel.findByIdAndDelete(review._id)
        if (deletedReview) {
            console.log(`Review deleted successfully: ${deletedReview}`)
        } else {
            console.log(`Review not found`)
        }
    }

    // getAllReviews
    // gets all the review objects in the reviews collection and returns them to the user
    async getAllReviews() {
        const reviews = await ReviewModel.find({}).exec()
        return reviews
    }

    // getReviewsFromUnit
    // gets all the review objects from the reviews collection from a specified unitId
    async getReviewsByUnitId(unitId) {
        const reviews = await ReviewModel.find({unitId: unitId}).exec()
        return reviews
    }

    // getReviewsByName
    // gets reviews from a specified individual from the database
    async getReviewsByNameId(nameId) {
        const reviews = await ReviewModel.find({nameId: nameId}).exec()
        return reviews
    }

}