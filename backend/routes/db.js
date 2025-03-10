require("dotenv").config()
const Review = require('../models/review')
const Activity = require('../models/activity')

const mongoose = require('mongoose')

// Have this here for now but could remove it to just have the separate connection call on connection.js
// I believe I only need one of them
// connection = mongoose.connect(`${process.env.DB_URL}`)
//     .then(
//         () => { console.log('Connected to MongoDB') },
//         err => { console.error('Error connecting to database: ', err) }
//     )

// schemas

// Activity Schema
const ActivitySchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
        description: { type: String, required: true },
        location: { type: String, required: true },
        dateStart: { type: String, required: false },
        dateEnd: { type: String, required: false },
        hoursOpen: { type: String, required: true }
    }
)
const ActivityModel = mongoose.model('activites', ActivitySchema)

// Review Schema
const ReviewSchema = mongoose.Schema(
    {
        unitId: { type: String, required: true },
        name: { type: String, required: true },
        nameId: { type: String, required: true },
        reviewText: { type: String, required: true },
        rating: { type: Number, required: true },
        verified: { type: Boolean, required: true },
    }
)
const ReviewModel = mongoose.model('reviews', ReviewSchema)

module.exports = class DBWrapper {
    constructor() {

    }

    // Activity functions

    // AddActivity
    async addActivity(activity) {
        console.log('addActivity not tested yet')
        const mongoDBActivity = new ActivityModel(activity)
        await mongoDBActivity.save()
        activity._id = mongoDBActivity._id
        return activity
    }

    // deleteActivity
    async deleteActivity(activity) {
        console.log('deleteActivity not tested yet')
        const deletedActivity = await ActivityModel.findByIdAndDelete(activity._id)
        if (deletedActivity) {
            console.log(`Review deleted successfully: ${deletedActivity}`)
        } else {
            console.log(`Review not found`)
        }
    }

    // getActivitiesByType
    async getActivitiesByType(type) {
        console.log('getActivitiesByType not tested yet')
        const activites = await ActivityModel.find({type: type}).exec()
        return activites

    }

    // getAllActivities
    async getAllActivities() {
        console.log('getAllActivities not tested yet')
        const activites = await ActivityModel.find({}).exec()
        return activites
    }

    // updateActivity
    async updateActivity(activity) {
        console.log('updateActivity not completed yet')
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


    // updateVerification
    // updates the verification field to true
    async updateVerification(review) {
        let newReview = await ReviewModel.find({_id: review._id})
        newReview.verified = true
        await newReview.save()
        return newReview
    }
    

}