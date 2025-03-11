const mongoose = require('mongoose')

module.exports = class Person {
    name = null
    username = null
    password = null
    type = null
    unitsStayedIn = null
    unitsOwned = null

    constructor(name, username, password, type, unitsStayedIn, unitsOwned) {
        this.name = name
        this.username = username
        this.password = password
        this.type = type
        this.unitsStayedIn = unitsStayedIn
        this.unitsOwned = unitsOwned
    }
}