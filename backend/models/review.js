const mongoose = require('mongoose')

module.exports = class Review {
    unitId = null
    name = null
    nameId = null
    reviewText = null
    rating = null

    constructor(unitId, name, nameId, reviewText, rating) {
        this.unitId = unitId
        this.name = name
        this.nameId = nameId
        this.reviewText = reviewText
        this.rating = rating
    }
}