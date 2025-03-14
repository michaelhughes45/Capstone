const mongoose = require('mongoose')

module.exports = class Activity {
    name = null
    type = null
    description = null
    location = null
    dateStart = null
    dateEnd = null
    hoursOpen = null

    constructor(name, type, description, location, dateStart, dateEnd, hoursOpen) {
        this.name = name
        this.type = type
        this.description = description
        this.location = location
        this.dateStart = dateStart
        this.dateEnd = dateEnd
        this.hoursOpen = hoursOpen
    }
}