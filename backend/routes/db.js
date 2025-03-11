require("dotenv").config()
const Review = require('../models/review')
const Activity = require('../models/activity')
const Person = require('../models/person')

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

// Person Schema
const PersonSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        type: { type: String, required: true },
        unitsStayedIn: { type: [String], default: [] },
        unitsOwned: { type: [String], default: [] }
    }
)
const PersonModel = mongoose.model('persons', PersonSchema)

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

    // *******
    // Activity functions
    // *******

    // AddActivity
    async addActivity(activity) {
        const mongoDBActivity = new ActivityModel(activity)
        await mongoDBActivity.save()
        activity._id = mongoDBActivity._id
        return activity
    }

    // deleteActivity
    async deleteActivity(activity) {
        const deletedActivity = await ActivityModel.findByIdAndDelete(activity._id)
        if (deletedActivity) {
            console.log(`Review deleted successfully: ${deletedActivity}`)
        } else {
            console.log(`Review not found`)
        }
    }

    // getActivitiesByType
    async getActivitiesByType(type) {
        const activites = await ActivityModel.find({type: type}).exec()
        return activites
    }

    // getAllActivities
    async getAllActivities() {
        const activites = await ActivityModel.find({}).exec()
        return activites
    }

    // updateActivity
    async updateActivity(activity) {
        try {
            const updatedActivity = await ActivityModel.findByIdAndUpdate( activity._id,
                { $set: activity },
                { new: true, runValidators: true } // Ensures updated fields follow schema validation
            );
    
            if (!updatedActivity) {
                console.log(`Activity with ID ${activity._id} not found`)
                return null
            }
    
            console.log(`Activity updated successfully: ${updatedActivity}`)
            return updatedActivity
        } catch (error) {
            console.error('Error updating activity:', error)
            return null
        }
    }

    // *******
    // Person Functions
    // *******

    // addPerson
    async addPerson(person) {
        console.log('addPerson() not tested yet')
        const mongoDBPerson = new PersonModel(person)
        await mongoDBPerson.save()
        person._id = mongoDBPerson._id
        return person
    }

    // deletePerson
    async deletePerson(person) {
        console.log('deletePerson() not tested yet')
        const deletedPerson = await PersonModel.findByIdAndDelete(person._id)
        if (deletedPerson) {
            console.log(`Review deleted successfully: ${deletedPerson}`)
        } else {
            console.log(`Review not found`)
        }
    }

    // getAllPeople
    async getAllPeople() {
        console.log('getAllPeople() not tested yet')
        const people = await PersonModel.find({}).exec()
        return people
    }

    // getPersonById
    async getPersonById(id) {
        console.log('getPersonById() not tested yet')
        const person = await PersonModel.find({_id: id})
        return person
    }

    // getPersonByUsername
    async getPersonByUsername(username) {
        console.log('getPersonByUsername() not tested yet')
        const person = await PersonModel.find({username: username}).exec()
        return person
    }

    // getUnitsOwned
    async getUnitsOwned(username) {
        console.log('getUnitsOwned() not tested yet')
        const person = await PersonModel.findOne({ username }).select('unitsOwned').exec()

        if (!person) {
            console.log(`Person with username ${username} not found`)
            return null
        }
        return person.unitsOwned

    }

    // getUnitsStayedIn
    async getUnitsStayedIn(username) {
        console.log('getUnitsStayedIn() not tested yet')
        const person = await PersonModel.findOne({ username }).select('unitsStayedIn').exec()

        if (!person) {
            console.log(`Person with username ${username} not found`)
            return null
        }
        return person.unitsStayedIn
    }

    // updatePerson
    async updatePerson(person) {
        console.log('updatePerson() not tested yet')
        try {
            const updatedPerson = await PersonModel.findByIdAndUpdate( person._id,
                { $set: person },
                { new: true, runValidators: true } // Ensures updated fields follow schema validation
            );
    
            if (!updatedPerson) {
                console.log(`person with ID ${person._id} not found`)
                return null
            }
    
            console.log(`Person updated successfully: ${updatedPerson}`)
            return updatedPerson
        } catch (error) {
            console.error('Error updating person:', error)
            return null
        }
    }

    // *******
    // Review functions
    // *******
    
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
    async updateReview(review) {
        try {
            const updatedReview = await ReviewModel.findByIdAndUpdate(
                review._id,
                { $set: review },
                { new: true, runValidators: true } // Ensures updated fields follow schema validation
            )
    
            if (!updatedReview) {
                console.log(`Review with ID ${review._id} not found`)
                return null
            }
    
            console.log(`Review updated successfully: ${updatedReview}`)
            return updatedReview
        } catch(error) {
            console.error('Error updating review:', error)
            return null
        }
    }
    

}