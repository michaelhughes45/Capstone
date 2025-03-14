const mongoose = require('mongoose')

module.exports = class Stay {
    personId = null
    unitId = null
    ownerId
    startDate = null
    endDate = null
    dates = null
    paymentStatus = null
    status

    constructor(personId, ownerId, unitId, startDate, endDate, dates, paymentStatus, status) {
        this.personId = personId
        this.ownerId = ownerId
        this.unitId = unitId
        this.startDate = startDate
        this.endDate = endDate
        this.dates = dates
        this.paymentStatus = paymentStatus
        this.status = status
    }
    
}