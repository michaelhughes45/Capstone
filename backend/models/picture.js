const mongoose = require('mongoose')

module.exports = class Picture {
    unitId = null
    pictureUrl = null
    displayOrder = null

    constructor(unitId, pictureUrl, displayOrder) {
        this.unitId = unitId
        this.pictureUrl = pictureUrl
        this.displayOrder = displayOrder
    }
}