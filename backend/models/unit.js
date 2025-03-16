const mongoose = require('mongoose')

module.exports = class Unit {
    ownerId = null
    address = null
    unitNumber = null
    numberBedrooms = null
    datesOccupied = null
    sleeps = null
    price = null
    rating = null
    shortDescription = null
    description = null
    amenities = null

    constructor(ownerId, address, unitNumber, numberBedrooms, datesOccupied, sleeps, price, rating, shortDescription, description, amenities) {
        this.ownerId = ownerId
        this.address = address
        this.unitNumber = unitNumber
        this.numberBedrooms = numberBedrooms
        this.datesOccupied = datesOccupied
        this.sleeps = sleeps
        this.price = price
        this.rating = rating
        this.shortDescription = shortDescription
        this.description = description
        this.amenities = amenities
    }
}