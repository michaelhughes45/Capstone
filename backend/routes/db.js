require("dotenv").config()
const Review = require('../models/review')
const Activity = require('../models/activity')
const Person = require('../models/person')
const Stay = require('../models/stay')

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
        verified: { type: Boolean, required: true }
    }
)
const ReviewModel = mongoose.model('reviews', ReviewSchema)

// Stay Schema
const StaySchema = mongoose.Schema(
    {
        personId: { type: String, required: true },
        ownerId: { type: String, required: true },
        unitId: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        dates: { type: [String], required: true },
        paymentStatus: { type: String, required: true },
        status: { type: String, required: true }
    }
)
const StayModel = mongoose.model('stays', StaySchema)

module.exports = class DBWrapper {
    constructor() {

    }

    // *******
    // Activity functions
    // *******

    // AddActivity
    async addActivity(activity) {
        try {
            const mongoDBActivity = new ActivityModel(activity)
            await mongoDBActivity.save()
            activity._id = mongoDBActivity._id
            return activity
        } catch(error) {
            console.error('Error adding activity:', error)
            return null
        }
    }

    // deleteActivity
    async deleteActivity(activity) {
        try {
            const deletedActivity = await ActivityModel.findByIdAndDelete(activity._id)
            if (deletedActivity) {
                console.log(`Review deleted successfully: ${deletedActivity}`)
            } else {
                console.log(`Review not found`)
            }
        } catch(error) {
            console.error('Error deleting activity:', error)
            return null
        }
    }

    // getActivitiesByType
    async getActivitiesByType(type) {
        try {
            const activites = await ActivityModel.find({type: type}).exec()
            return activites
        } catch(error) {
            console.error('Error getting activity by Type:', error)
            return null
        }
    }

    // getAllActivities
    async getAllActivities() {
        try {
            const activites = await ActivityModel.find({}).exec()
            return activites
        } catch(error) {
            console.error('Error getting all activities:', error)
            return null
        }
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
        try {
            const mongoDBPerson = new PersonModel(person)
            await mongoDBPerson.save()
            person._id = mongoDBPerson._id
            return person
        } catch(error) {
            console.error('Error adding person:', error)
            return null
        }
    }

    // deletePerson
    async deletePerson(person) {
        try {
            const deletedPerson = await PersonModel.findByIdAndDelete(person._id)
            if (deletedPerson) {
                console.log(`Review deleted successfully: ${deletedPerson}`)
            } else {
                console.log(`Review not found`)
            }
        } catch(error) {
            console.error('Error deleting person:', error)
            return null
        }
    }

    // getAllPeople
    async getAllPeople() {
        try {
            const people = await PersonModel.find({}).exec()
            return people
        } catch(error) {
            console.error('Error getting all people:', error)
            return null
        }
    }

    // getPersonById
    async getPersonById(id) {
        try {
            const person = await PersonModel.find({_id: id})
            return person
        } catch(error) {
            console.error('Error getting person by Id:', error)
            return null
        }
    }

    // getPersonByUsername
    async getPersonByUsername(username) {
        try {
            const person = await PersonModel.find({username: username}).exec()
            return person
        } catch(error) {
            console.error('Error getting person by username:', error)
            return null
        }
    }

    // getUnitsOwned
    async getUnitsOwned(username) {
        try {
            const person = await PersonModel.findOne({ username }).select('unitsOwned').exec()
            if (!person) {
                console.log(`Person with username ${username} not found`)
                return null
            }
            return person.unitsOwned
        } catch(error) {
            console.error('Error getting units owned:', error)
            return null
        }
    }

    // getUnitsStayedIn
    async getUnitsStayedIn(username) {
        try {
            const person = await PersonModel.findOne({ username }).select('unitsStayedIn').exec()
            if (!person) {
                console.log(`Person with username ${username} not found`)
                return null
            }
            return person.unitsStayedIn
        } catch(error) {
            console.error('Error units stayed in:', error)
            return null
        }
    }

    // updatePerson
    async updatePerson(person) {
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
        try {
            const mongoDBReview = new ReviewModel(review)
            await mongoDBReview.save()
            review._id = mongoDBReview._id
            return review
        } catch(error) {
            console.error('Error adding review:', error)
            return null
        }
    }

    // deleteReview()
    // deletes a review from the database
    async deleteReview(review) {
        try {
            const deletedReview = await ReviewModel.findByIdAndDelete(review._id)
            if (deletedReview) {
                console.log(`Review deleted successfully: ${deletedReview}`)
            } else {
                console.log(`Review not found`)
            }
        } catch(error) {
            console.error('Error deleting review:', error)
            return null
        }
    }

    // getAllReviews
    // gets all the review objects in the reviews collection and returns them to the user
    async getAllReviews() {
        try {
            const reviews = await ReviewModel.find({}).exec()
            return reviews
        } catch(error) {
            console.error('Error getting all reviews:', error)
            return null
        }
    }

    // getReviewsFromUnit
    // gets all the review objects from the reviews collection from a specified unitId
    async getReviewsByUnitId(unitId) {
        try {
            const reviews = await ReviewModel.find({unitId: unitId}).exec()
            return reviews
        } catch(error) {
            console.error('Error getting reviews by unitId:', error)
            return null
        }
    }

    // getReviewsByName
    // gets reviews from a specified individual from the database
    async getReviewsByNameId(nameId) {
        try {
            const reviews = await ReviewModel.find({nameId: nameId}).exec()
            return reviews
        } catch(error) {
            console.error('Error getting reviews by nameId:', error)
            return null
        }
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

    // *******
    // Stay Functions
    // *******

    // addStay()
    async addStay(stay) {
        console.log('addStay() not tested yet')
        try {
            const mongoDBStay = new StayModel(stay)
            await mongoDBStay.save()
            stay._id = mongoDBStay._id
            return stay
        } catch(error) {
            console.error('Error adding stay:', error)
            return null
        }
    }

    // deleteStay()
    async deleteStay(stay) {
        console.log('deleteStay() not tested yet')
        try {
            const deletedStay = await StayModel.findByIdAndDelete(stay._id)
            if (deletedStay) {
                console.log(`Stay deleted successfully: ${deletedStay}`)
            } else {
                console.log(`Stay not found`)
            }
        } catch(error) {
            console.error('Error deleting stay:', error)
            return null
        }
    }

    // getAllStays()
    async getAllStays() {
        console.log('getAllStays() not tested yet')
        try {
            const stays = await StayModel.find({}).exec()
            return stays
        } catch(error) {
            console.error('Error getting all stays:', error)
            return null
        }
    }

    // getStaysByPaymentStatus()
    async getStaysByPaymentStatus(paymentStatus) {
        console.log('getStaysByPaymentStatus() not tested yet')
        try {
            const stays = await StayModel.find({paymentStatus: paymentStatus}).exec()
            return stays
        } catch(error) {
            console.error('Error getting stays by paymentStatus:', error)
            return null
        }
    }

    // getStaysByOwnerId()
    async getStaysByOnwerId(ownerId) {
        console.log('getStaysByOwnerId() not tested yet')
        try {
            const stays = await StayModel.find({ownerId: ownerId}).exec()
            return stays
        } catch(error) {
            console.error('Error getting stays by ownerId:', error)
            return null
        }
    }

    // getStaysByPersonId()
    async getStaysByPersonId(personId) {
        console.log('getStaysByPersonId() not tested yet')
        try {
            const stays = await StayModel.find({personId: personId}).exec()
            return stays
        } catch(error) {
            console.error('Error getting stays by personId:', error)
            return null
        }
    }

    // getStaysByUnitId()
    async getStaysByUnitId(unitId) {
        console.log('getStaysByUnitId() not tested yet')
        try {
            const stays = await StayModel.find({unitId: unitId}).exec()
            return stays
        } catch(error) {
            console.error('Error getting stays by unitId:', error)
            return null
        }
    }

    // updateStays()
    async updateStays(stay) {
        console.log('updateStay() not tested yet')
        try {
            const updatedStay = await StayModel.findByIdAndUpdate(
                stay._id,
                { $set: stay },
                { new: true, runValidators: true } // Ensures updated fields follow schema validation
            )
    
            if (!updatedStay) {
                console.log(`Stay with ID ${stay._id} not found`)
                return null
            }
    
            console.log(`Stay updated successfully: ${updatedStay}`)
            return updatedStay
        } catch(error) {
            console.error('Error updating stay:', error)
            return null
        }
    }
    
}