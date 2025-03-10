const mongoose = require('mongoose')

module.exports = class Activity {
    name = null
    type = null
    description = null
    location = null
    dateStart = null
    dateEnd = null
    hoursOpen = null
}