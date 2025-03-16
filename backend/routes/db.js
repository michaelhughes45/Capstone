require("dotenv").config()
const Review = require('../models/review')
const Activity = require('../models/activity')
const Person = require('../models/person')
const Picture = require('../models/picture')
const Stay = require('../models/stay')
const Unit = require('../models/unit')

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

const PictureSchema = mongoose.Schema(
    {
        unitId: { type: String, required: true },
        pictureUrl: { type: String, required: true },
        displayOrder: { type: Number, required: true },
    }
)
const PictureModel = mongoose.model('pictures', PictureSchema)

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

const UnitSchema = mongoose.Schema(
    {
        ownerId: { type: String, required: true },
        address: { type: String, required: true },
        unitNumber: { type: String, required: true },
        numberBedrooms: { type: Number, required: true },
        datesOccupied: { type: [String], required: true },
        sleeps: { type: Number, required: true },
        price: { type: Number, required: true },
        rating: { type: Number, required: true },
        shortDescription: { type: String, required: true },
        description: { type: String, required: true },
        amenities: { type: [String], required: true }
    }
)
const UnitModel = mongoose.model('units', UnitSchema)

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
    // Picture functions
    // *******
    
    // addPicture()
    async addPicture(picture) {
        console.log('addPicture() not tested yet')
        try {
            const mongoDBPicture = new PictureModel(picture)
            await mongoDBPicture.save()
            picture._id = mongoDBPicture._id
            return picture
        } catch(error) {
            console.error('Error adding picture:', error)
            return null
        }
    }

    // deletePicture()
    async deletePicture(picture) {
        console.log('deletePicture() not tested yet')
        try {
            const deletedPicture = await PictureModel.findByIdAndDelete(picture._id)
            if (deletedPicture) {
                console.log(`Picture deleted successfully: ${deletedPicture}`)
            } else {
                console.log(`Picture not found`)
            }
        } catch(error) {
            console.error('Error deleting picture:', error)
            return null
        }
    }

    // getAllPictures()
    async getAllPictures() {
        console.log('getAllPictures() not tested yet')
        try {
            const pictures = await PictureModel.find({}).exec()
            return pictures
        } catch(error) {
            console.error('Error getting all pictures:', error)
            return null
        }
    }

    // getPicturesByUnitId()
    async getPicturesByUnitId(unitId) {
        console.log('getPicturesByUnitId() not tested yet')
        try {
            const pictures = await PictureModel.find({unitId: unitId}).sort({displayOrder: 1}).exec()
            return pictures
        } catch(error) {
            console.error('Error getting pictures by unitId:', error)
            return null
        }
    }

    // updatePicture()
    async updatePicture(picture) {
        console.log('updatePicture() not tested yet')
        try {
            const updatedPicture = await PictureModel.findByIdAndUpdate(
                picture._id,
                { $set: picture },
                { new: true, runValidators: true } // Ensures updated fields follow schema validation
            )
    
            if (!updatedPicture) {
                console.log(`Picture with ID ${picture._id} not found`)
                return null
            }
    
            console.log(`Picture updated successfully: ${updatedPicture}`)
            return updatedPicture
        } catch(error) {
            console.error('Error updating picture:', error)
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

    // *******
    // Unit Functions
    // *******

    // addUnit
    async addUnit(unit) {
        console.log('addUnit not tested yet')
        try {
            const mongoDBUnit = new UnitModel(unit)
            await mongoDBUnit.save()
            unit._id = mongoDBunit._id
            return unit
        } catch(error) {
            console.error('Error adding unit:', error)
            return null
        }
    }

    // deleteUnit
    async deleteUnit(unit) {
        console.log('deleteUnit not tested yet')
        try {
            const deletedUnit = await UnitModel.findByIdAndDelete(unit._id)
            if (deletedUnit) {
                console.log(`Unit deleted successfully: ${deletedUnit}`)
            } else {
                console.log(`Unit not found`)
            }
        } catch(error) {
            console.error('Error deleting unit:', error)
            return null
        }
    }

    // getAllUnits
    async getAllUnits() {
        console.log('getAllUnits not tested yet')
        try {
            const units = await UnitModel.find({}).exec()
            return units
        } catch(error) {
            console.error('Error getting all units:', error)
            return null
        }
    }

    // getUnitById()
    async getUnitById(id) {
        console.log('getUnitById not tested yet')
        try {
            const unit = await UnitModel.find({_id: id}).exec()
            return unit
        } catch(error) {
            console.error('Error getting unit by id:', error)
            return null
        }
    }

    // getUnitsByAddress
    async getUnitsByAddress(address) {
        console.log('getUnitsByAddress not tested yet')
        try {
            const units = await UnitModel.find({address: address}).exec()
            return units
        } catch(error) {
            console.error('Error getting units by address:', error)
            return null
        }
    }

    // getUnitsByNumberBedrooms
    async getUnitsByNumberBedrooms(numberBedrooms) {
        console.log('getUnitsByNumberBedrooms not tested yet')
        try {
            const units = await UnitModel.find({ numberBedrooms: numberBedrooms }).exec()
            return units
        } catch (error) {
            console.error("Error retrieving units with numberBedrooms:", error)
            return null
        }
    }

    // getUnitsByNumberBedroomsHigh
    async getUnitsByNumberBedroomsHigh() {
        console.log('getUnitsByNumberBedroomsHigh not tested yet')
        try {
            const units = await UnitModel.find({}).sort({ numberBedrooms: -1 }).exec() // -1 for descending order (high to low)
            return units
        } catch (error) {
            console.error("Error retrieving units sorted by numberBedrooms (high to low):", error)
            return null
        }
    }

    // getUnitsByNumberBedroomsLow
    async getUnitsByNumberBedroomsLow() {
        console.log('getUnitsByNumberBedroomsLow not tested yet')
        try {
            const units = await UnitModel.find({}).sort({ numberBedrooms: 1 }).exec() // 1 for ascending order (low to high)
            return units
        } catch (error) {
            console.error("Error retrieving units sorted by numberBedrooms (low to high):", error)
            return null
        }   
    }

    // getUnitsByOwnerId
    async getUnitsByOwnerId(ownerId) {
        console.log('getUnitsByOwnerId not tested yet')
        try {
            const units = await UnitModel.find({ ownerId: ownerId }).exec()
            return units
        } catch (error) {
            console.error("Error retrieving units with ownerId:", error)
            return null
        }
    }

    // getUnitsByPrice
    async getUnitsByPrice(price) {
        console.log('getUnitsByPrice not tested yet')
        try {
            const units = await UnitModel.find({ price: price }).exec()
            return units
        } catch (error) {
            console.error("Error retrieving units with price:", error)
            return null
        }
    }

    // getUnitsByPriceHigh
    async getUnitsByPriceHigh() {
        console.log('getUnitsByPriceHigh not tested yet')
        try {
            const units = await UnitModel.find({}).sort({ price: -1 }).exec() // -1 for descending order (high to low)
            return units
        } catch (error) {
            console.error("Error retrieving units sorted by price (high to low):", error)
            return null
        }
    }

    // getUnitsByPriceLow
    async getUnitsByPriceLow() {
        console.log('getUnitsByPriceLow not tested yet')
        try {
            const units = await UnitModel.find({}).sort({ price: 1 }).exec() // 1 for ascending order (low to high)
            return units
        } catch (error) {
            console.error("Error retrieving units sorted by number of prices (low to high):", error)
            return null
        } 
    }

    // getUnitsBySleeps
    async getUnitsBySleeps(sleeps) {
        console.log('getUnitsBySleeps not tested yet')
        try {
            const units = await UnitModel.find({ sleeps: sleeps }).exec()
            return units
        } catch (error) {
            console.error("Error retrieving units with sleeps:", error)
            return null
        }
    }

    // getUnitsBySleepsHigh
    async getUnitsBySleepsHigh() {
        console.log('getUnitsBySleepsHigh not tested yet')
        try {
            const units = await UnitModel.find({}).sort({ sleeps: -1 }).exec() // -1 for descending order (high to low)
            return units
        } catch (error) {
            console.error("Error retrieving units sorted by sleeps (high to low):", error)
            return null
        }
    }

    // getUnitsBySleepsLow
    async getUnitsBySleepsLow() {
        console.log('getUnitsBySleepsLow not tested yet')
        try {
            const units = await UnitModel.find({}).sort({ sleeps: 1 }).exec() // 1 for ascending order (low to high)
            return units
        } catch (error) {
            console.error("Error retrieving units sorted by sleeps (low to high):", error)
            return null
        } 
    }

    // getUnitsByRating
    async getUnitsByRating(rating) {
        console.log('getUnitsByRating not tested yet')
        try {
            const units = await UnitModel.find({ rating: rating }).exec()
            return units
        } catch (error) {
            console.error("Error retrieving units with rating:", error)
            return null
        }
    }

    // getUnitsByRatingHigh
    async getUnitsByRatingHigh() {
        console.log('getUnitsByRatingHigh not tested yet')
        try {
            const units = await UnitModel.find({}).sort({ rating: -1 }).exec() // -1 for descending order (high to low)
            return units
        } catch (error) {
            console.error("Error retrieving units sorted by rating (high to low):", error)
            return null
        }
    }

    // getUnitsByRatingLow
    async getUnitsByRatingLow() {
        console.log('getUnitsByRatingLow not tested yet')
        try {
            const units = await UnitModel.find({}).sort({ rating: 1 }).exec() // 1 for ascending order (low to high)
            return units
        } catch (error) {
            console.error("Error retrieving units sorted by rating (low to high):", error)
            return null
        } 
    }

    // getUnitsByAmenitiesHotTub
    async getUnitsWithAmenitiesHotTub() {
        console.log('getUnitsByAmenitiesHotTub not tested yet')
        try {
            const units = await UnitModel.find({ amenities: "hotTub" }).exec()
            return units
        } catch (error) {
            console.error("Error retrieving units with hot tub:", error)
            return null
        }
    }

    // getUnitsWithHotTubAndPool
    async getUnitsWithAmenitiesHotTubAndPool() {
        console.log('getUnitsByAmenitiesHotTubAndPool not tested yet')
        try {
            const units = await UnitModel.find({ amenities: { $all: ["hotTub", "pool"] } }).exec()
            return units
        } catch (error) {
            console.error("Error retrieving units with hot tub and pool:", error)
            return null
        }
    }

    // getUnitsByAmenitiesPool
    async getUnitsWithAmenitiesPool() {
        console.log('getUnitsByAmenitiesPool not tested yet')
        try {
            const units = await UnitModel.find({ amenities: "pool" }).exec()
            return units
        } catch (error) {
            console.error("Error retrieving units with pool:", error)
            return null
        }
    }

    // updateUnit
    async updateUnit(unit) {
        console.log('updateUnit not tested yet')
        try {
            const updatedUnit = await UnitModel.findByIdAndUpdate(
                stay._id,
                { $set: unit },
                { new: true, runValidators: true } // Ensures updated fields follow schema validation
            )
    
            if (!updatedUnit) {
                console.log(`Stay with ID ${unit._id} not found`)
                return null
            }
    
            console.log(`Stay updated successfully: ${updatedUnit}`)
            return updatedUnit
        } catch(error) {
            console.error('Error updating unit:', error)
            return null
        }
    }
    
}