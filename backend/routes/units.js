Unit = require('../models/unit')
const DBWrapper = require('./db')
var express = require('express')
var router = express.Router()

// addUnit
router.post('/', async function(req, res, next) {
    console.log('POST addUnit')
    const { ownerId, address, unitNumber, numberBedrooms, datesOccupied, sleeps, price, rating, shortDescription, description, amenities } = req.body
    
    if (!ownerId || !address || !unitNumber || !numberBedrooms || !datesOccupied || !sleeps || !price || !rating || !shortDescription || !description || !amenities) {
        return res.status(400).json({ message: "Missing required fields" })
    }

    const db = new DBWrapper
    const unit = new Unit(
        req.body.ownerId, 
        req.body.address, 
        req.body.unitNumber, 
        req.body.numberBedrooms, 
        req.body.datesOccupied, 
        req.body.sleeps,
        req.body.price,
        req.body.rating,
        req.body.shortDescription,
        req.body.description,
        req.body.amenities
    )
    const savedUnit = await db.addUnit(unit)

    if (!savedUnit) {
        return res.status(500).json({ message: "Failed to add unit" });
    }
    
    res.status(200).json(savedUnit)
})

// deleteUnit
router.delete('/unit', async function (req, res, next) {
    console.log('DELETE deleteUnit')
    const db = new DBWrapper
    deleteUnit = await db.deleteUnit(req.body)
    
    if (!deleteUnit) {
        return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json({ message: "Unit deleted Successfully" })
})

// getAllUnits
router.get('/', async function(req, res, next) {
    console.log('GET getAllUnits')
    const db = new DBWrapper
    var units = await db.getAllUnits()

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).send(units)
})

// getUnitById
router.get('/id', async function(req, res, next) {
    console.log('GET getUnitsByAddress')
    const db = new DBWrapper
    var unit = await db.getUnitById(req.query._id)

    if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).send(unit)
})

// getUnitsByAddress
router.get('/address', async function(req, res, next) {
    console.log('GET getUnitsByAddress')
    const db = new DBWrapper
    var units = await db.getUnitsByAddress(req.query.address)

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found for this address" });
    }

    res.status(200).send(units)
})

// getUnitsByNumberBedrooms
router.get('/numberBedrooms', async function(req, res, next) {
    console.log('GET getUnitsByNumberBedrooms')
    const db = new DBWrapper
    const bedrooms = parseInt(req.query.numberBedrooms)

    if (isNaN(bedrooms)) {
        return res.status(400).json({ message: "Invalid numberBedrooms value" });
    }

    var units = await db.getUnitsByNumberBedrooms(bedrooms)

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found with that number of bedrooms" });
    }

    res.status(200).send(units)
})

// getUnitsByNumberBedroomsHigh
router.get('/numberBedrooms/high', async function(req, res, next) {
    console.log('GET getUnitsByNumberBedroomsHigh')
    const db = new DBWrapper
    var units = await db.getUnitsByNumberBedroomsHigh()

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found with high number of bedrooms" })
    }

    res.status(200).send(units)
})

// getUnitsByNumberBedroomsLow
router.get('/numberBedrooms/low', async function(req, res, next) {
    console.log('GET getUnitsByNumberBedroomsLow')
    const db = new DBWrapper
    var units = await db.getUnitsByNumberBedroomsLow()

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found with low number of bedrooms" })
    }

    res.status(200).send(units)
})

// getUnitsByOwnerId
router.get('/ownerId', async function(req, res, next) {
    console.log('GET getUnitsByOwnerId')
    const db = new DBWrapper
    var units = await db.getUnitsByOwnerId(req.query.ownerId)

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found with that price" })
    }

    res.status(200).send(units)
})

// getUnitsByPrice
router.get('/price', async function(req, res, next) {
    console.log('GET getUnitsByPrice')
    const db = new DBWrapper
    const price = parseFloat(req.query.price)

    if (isNaN(price)) {
        return res.status(400).json({ message: "Invalid price value" })
    }

    var units = await db.getUnitsByPrice(price)

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found with that price" })
    }

    res.status(200).send(units)
})

// getUnitsByPriceHigh
router.get('/price/high', async function(req, res, next) {
    console.log('GET getUnitsByPriceHigh')
    const db = new DBWrapper
    var units = await db.getUnitsByPriceHigh()

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found at high price" })
    }

    res.status(200).send(units)
})

// getUnitsByPriceLow
router.get('/price/low', async function(req, res, next) {
    // console.log('GET getUnitsByPriceLow')
    const db = new DBWrapper
    var units = await db.getUnitsByPriceLow()

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found at low price" });
    }
    
    res.status(200).send(units)
})

// getUnitsBySleeps
router.get('/sleeps', async function(req, res, next) {
    // console.log('GET getUnitsBySleeps')
    const db = new DBWrapper
    const sleeps = parseFloat(req.query.sleeps)
    if (isNaN(sleeps)) {
        return res.status(400).json({ message: "Invalid sleep value" })
    }

    var units = await db.getUnitsBySleeps(req.query.sleeps)

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found with that sleeps" })
    }
    res.status(200).send(units)
})

// getUnitsBySleepsHigh
router.get('/sleeps/high', async function(req, res, next) {
    // console.log('GET getUnitsBySleepsHigh')
    const db = new DBWrapper
    var units = await db.getUnitsBySleepsHigh()
    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found at high sleeps" });
    }
    res.status(200).send(units)
})

// getUnitsBySleepsLow
router.get('/sleeps/low', async function(req, res, next) {
    // console.log('GET getUnitsBySleepsLow')
    const db = new DBWrapper
    var units = await db.getUnitsBySleepsLow()
    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found at low sleeps" });
    }
    res.status(200).send(units)
})

// getUnitsByRating
router.get('/rating', async function(req, res, next) {
    // console.log('GET getUnitsByRating')
    const db = new DBWrapper
    const rating = parseFloat(req.query.rating)

    if (isNaN(rating)) {
        return res.status(400).json({ message: "Invalid rating value" });
    }

    var units = await db.getUnitsByRating(rating)

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found with that rating" });
    }
    res.status(200).send(units)
})

// getUnitsByRatingHigh
router.get('/rating/high', async function(req, res, next) {
    // console.log('GET getUnitsByRatingHigh')
    const db = new DBWrapper
    var units = await db.getUnitsByRatingHigh()

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found with high ratings" });
    }

    res.status(200).send(units)
})

// getUnitsByRatingLow
router.get('/rating/low', async function(req, res, next) {
    // console.log('GET getUnitsByRatingLow')
    const db = new DBWrapper
    var units = await db.getUnitsByRatingLow()

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found with low ratings" });
    }

    res.status(200).send(units)
})

// getUnitsByAmenitiesHotTub
router.get('/address/hotTub', async function(req, res, next) {
    // console.log('GET getUnitsWithAmenitiesHotTub')
    const db = new DBWrapper
    var units = await db.getUnitsWithAmenitiesHotTub()

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found with hot tub" });
    }

    res.status(200).send(units)
})

// getUnitsWithHotTubAndPool
router.get('/address/hotTubPool', async function(req, res, next) {
    // console.log('GET getUnitsWithAmenitiesHotTubAndPool')
    const db = new DBWrapper
    var units = await db.getUnitsWithAmenitiesHotTubAndPool()

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found with both hot tub and pool" });
    }

    res.status(200).send(units)
})

// getUnitsByAmenitiesPool
router.get('/address/pool', async function(req, res, next) {
    // console.log('GET getUnitsWithAmenitiesHotTub')
    const db = new DBWrapper
    var units = await db.getUnitsWithAmenitiesPool()

    if (!units || units.length === 0) {
        return res.status(404).json({ message: "No units found with a pool" });
    }

    res.status(200).send(units)
})

// updateUnit
router.put('/unit', async function (req, res, next) {
    // console.log('PUT updateUnit')
    const db = new DBWrapper
    const updatedUnit = await db.updateUnit(req.body)

    if(!updatedUnit) {
        return res.status(400).json({ message: "Unit not found" })
    }
    res.status(200).json(updatedUnit)
})


module.exports = router