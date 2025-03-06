const mongoose = require('mongoose')

module.exports = class Review {
    unitId = null
    address = null
    unitNumber = null
    name = null
    reviewText = null
    rating = null

    constructor(unitId, address, unitNumber, name, reviewText, rating) {
        this.unitId = unitId
        this.address = address
        this.unitNumber = unitNumber
        this.name = name
        this.reviewText = reviewText
        this.rating = rating
    }
}