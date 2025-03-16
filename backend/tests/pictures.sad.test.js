const request = require('supertest')
const express = require('express')
const router = require('../routes/pictures')
const DBWrapper = require('../routes/db')

jest.mock('../routes/db') // Mock the DBWrapper

const app = express()
app.use(express.json())
app.use('/pictures', router)

describe('Pictures Routes - Sad Path Tests', () => {
    let mockDB

    beforeEach(() => {
        mockDB = new DBWrapper()
        DBWrapper.mockImplementation(() => mockDB)
        jest.clearAllMocks()
    })

    // ❌ **POST /pictures - Missing required fields**
    test('POST /pictures should return 400 if required fields are missing', async () => {
        const res = await request(app).post('/pictures').send({
            unitId: "12345"  // Missing pictureUrl and displayOrder
        })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Missing required fields" })
    })

    // ❌ **DELETE /pictures/picture - Picture not found**
    test('DELETE /pictures/picture should return 404 if picture does not exist', async () => {
        mockDB.deletePicture.mockResolvedValue(null)

        const res = await request(app).delete('/pictures/picture').send({ _id: "unknown_id" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "Picture not found" })
    })

    // ❌ **GET /pictures/unitId - No pictures for the given unit**
    test('GET /pictures/unitId should return 404 if no pictures exist for the given unitId', async () => {
        mockDB.getPicturesByUnitId.mockResolvedValue([])

        const res = await request(app).get('/pictures/unitId').query({ unitId: "non_existent_unit" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "No pictures found for this unit" })
    })

    // ❌ **GET /pictures/unitId - Missing unitId in query**
    test('GET /pictures/unitId should return 400 if unitId is not provided', async () => {
        const res = await request(app).get('/pictures/unitId')

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Unit ID is required" })
    })

    // ❌ **PUT /pictures/picture - Picture not found**
    test('PUT /pictures/picture should return 404 if picture does not exist', async () => {
        mockDB.updatePicture.mockResolvedValue(null)

        const res = await request(app).put('/pictures/picture').send({
            _id: "unknown_id",
            pictureUrl: "https://example.com/new_image.jpg",
            displayOrder: 4
        })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "picture not found" })
    })

    // ❌ **PUT /pictures/picture - Missing required fields**
    test('PUT /pictures/picture should return 400 if required fields are missing', async () => {
        const res = await request(app).put('/pictures/picture').send({
            _id: "12345",
        }) // Missing pictureUrl and displayOrder

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Missing required fields for update" })
    })
})
