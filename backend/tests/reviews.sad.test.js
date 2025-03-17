const request = require('supertest')
const express = require('express')
const router = require('../routes/reviews')
const DBWrapper = require('../routes/db')

jest.mock('../routes/db') // Mock DBWrapper

const app = express()
app.use(express.json())
app.use('/reviews', router)

describe('Reviews Routes - Sad Path Tests', () => {
    let mockDB

    beforeEach(() => {
        mockDB = new DBWrapper()
        DBWrapper.mockImplementation(() => mockDB)
        jest.clearAllMocks()
    })

    // ❌ **POST /reviews - Missing required fields**
    test('POST /reviews should return 400 if required fields are missing', async () => {
        const res = await request(app).post('/reviews').send({
            unitId: "12345",
            name: "John Doe"
            // Missing nameId, reviewText, rating, verified
        })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Missing required fields" })
    })

    // ❌ **GET /reviews/nameId - No reviews found**
    test('GET /reviews/nameId should return 404 if no reviews exist for given nameId', async () => {
        mockDB.getReviewsByNameId.mockResolvedValue([])

        const res = await request(app).get('/reviews/nameId').query({ nameId: "unknown_nameId" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "No reviews found for this nameId" })
    })

    // ❌ **GET /reviews/nameId - Missing query parameter**
    test('GET /reviews/nameId should return 400 if nameId is not provided', async () => {
        const res = await request(app).get('/reviews/nameId')

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "nameId is required" })
    })

    // ❌ **GET /reviews/unitId - No reviews found**
    test('GET /reviews/unitId should return 404 if no reviews exist for given unitId', async () => {
        mockDB.getReviewsByUnitId.mockResolvedValue([])

        const res = await request(app).get('/reviews/unitId').query({ unitId: "unknown_unitId" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "No reviews found for this unitId" })
    })

    // ❌ **GET /reviews/unitId - Missing query parameter**
    test('GET /reviews/unitId should return 400 if unitId is not provided', async () => {
        const res = await request(app).get('/reviews/unitId')

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "unitId is required" })
    })

    // ❌ **PUT /reviews/review - Updating non-existent review**
    test('PUT /reviews/review should return 404 if review does not exist', async () => {
        mockDB.updateReview.mockResolvedValue(null)

        const reviewToUpdate = { 
            _id: '4', 
            unitId: '456', 
            name: 'Alice', 
            nameId: '789', 
            reviewText: 'Fantastic Updated!', 
            rating: 4, 
            verified: true 
        }

        const res = await request(app).put('/reviews/review').send(reviewToUpdate)

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "Review not found" })
    })

    // ❌ **PUT /reviews/review - Missing required fields**
    test('PUT /reviews/review should return 400 if required fields are missing', async () => {
        const res = await request(app).put('/reviews/review').send({
            _id: "12345"
            // Missing reviewText or other required fields
        })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Missing required fields for update" })
    })

    // ❌ **DELETE /reviews/review - Review not found**
    test('DELETE /reviews/review should return 404 if review does not exist', async () => {
        mockDB.deleteReview.mockResolvedValue(null)

        const res = await request(app).delete('/reviews/review').send({ _id: "unknown_id" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "Review not found" })
    })
})
