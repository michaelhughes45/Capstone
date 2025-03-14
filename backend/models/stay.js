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

    constructor(personId, unitId, ownerId, startDate, endDate, dates, paymentStatus, status) {
        this.personId = personId
        this.unitId = unitId
        this.ownerId = ownerId
        this.startDate = startDate
        this.endDate = endDate
        this.dates = dates
        this.paymentStatus = paymentStatus
        this.status = status
    }
    
}