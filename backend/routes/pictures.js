Picture = require('../models/picture')
const DBWrapper = require('./db')
var express = require('express')
var router = express.Router()

// addPicture()
router.post('/', async function(req, res, next) {
    console.log('POST addPicture')
    const db = new DBWrapper
    const picture = new Picture(req.body.unitId, req.body.pictureUrl, req.body.displayOrder)
    const savedPicture = await db.addPicture(picture)
    
    res.status(200).json(savedPicture)
})

// deletePicture()
router.delete('/picture', async function (req, res, next) {
    console.log('DELETE deletePicture')
    const db = new DBWrapper
    const deletePicture = await db.deletePicture(req.body)
    if(deletePicture) {
        res.status(200).json({ message: "Picture deleted Successfully" })
    } else {
        res.status(404).json({ message: "Picture not found" })
    }
})

// getAllPictures()
router.get('/', async function(req, res, next) {
    console.log('GET getAllPictures')
    const db = new DBWrapper
    var pictures = await db.getAllPictures()
    res.status(200).send(pictures)
})

//  getPictureByUnitId()
router.get('/unitId', async function(req, res, next) {
    console.log('GET getPicturesByUnitId')
    const db = new DBWrapper
    var pictures = await db.getPicturesByUnitId(req.query.unitId)
    res.status(200).send(pictures)
})

// updatePicture()
router.put('/picture', async function (req, res, next) {
    console.log('PUT updatePicture')
    const db = new DBWrapper
    const updatedPicture = await db.updatePicture(req.body)

    if(!updatedPicture) {
        return res.status(400).json({ message: "picture not found" })
    }
    res.status(200).json(updatedPicture)
})

module.exports = router