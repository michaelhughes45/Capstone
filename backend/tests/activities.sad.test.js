const request = require('supertest');
const express = require('express')
const activitiesRouter = require('../routes/activities')
const DBWrapper = require('../routes/db');

const app = express()
app.use(express.json())
app.use('/activities', activitiesRouter)

jest.mock('../routes/db'); // Mock the database wrapper

describe('Activities Routes - Sad Path Tests', () => {
    let mockDB

    beforeEach(() => {
        mockDB = new DBWrapper()
        jest.clearAllMocks()
    })

    // ❌ **POST /activities - Missing required fields**
    test('POST /activities should return 400 when required fields are missing', async () => {
        mockDB.addActivity.mockResolvedValue(null)

        const res = await request(app).post('/activities').send({
            type: 'Outdoor',
            location: 'Park',
        })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Missing required fields" })
    })

    // ❌ **DELETE /activities/activity - Activity not found**
    test('DELETE /activities/activity should return 404 if activity does not exist', async () => {
        mockDB.deleteActivity.mockResolvedValue(null)

        const res = await request(app).delete('/activities/activity').send({ name: 'Nonexistent Activity' })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "Activity not found" })
    })

    // ❌ **GET /activities/type - No activities of given type**
    test('GET /activities/type should return 404 if no activities match type', async () => {
        mockDB.getActivitiesByType.mockResolvedValue([])

        const res = await request(app).get('/activities/type').query({ type: 'UnknownType' })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "No activities found for this type" })
    })

    // ❌ **GET /activities/type - Invalid type format**
    test('GET /activities/type should return 400 if type is missing', async () => {
        const res = await request(app).get('/activities/type')

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Activity type is required" })
    })

    // ❌ **GET /activities - No activities available**
    test('GET /activities should return 404 if no activities exist', async () => {
        mockDB.getAllActivities.mockResolvedValue([])

        const res = await request(app).get('/activities')

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "No activities found" })
    })

    test('PUT /activities/activity should return 404 if activity does not exist', async () => {
        mockDB.updateActivity.mockResolvedValue(null)
    
        const res = await request(app).put('/activities/activity').send({
            name: 'Nonexistent Activity',
            type: 'Outdoor',
            location: 'Park',
            description: 'A fun outdoor event',
            dateStart: '2025-06-01',
            dateEnd: '2025-06-02',
            hoursOpen: '10:00 AM - 5:00 PM'
        })
    
        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "Activity not found" })
    })
    
    // ❌ **PUT /activities/activity - Missing required fields**
    test('PUT /activities/activity should return 400 if required fields are missing', async () => {
        const res = await request(app).put('/activities/activity').send({
            name: 'Updated Activity',
            type: 'Outdoor' // ❌ Missing 'location', 'description', 'dateStart', etc.
        })
    
        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Missing required fields for update" })
    })
    
    // ❌ **PUT /activities/activity - Empty request body**
    test('PUT /activities/activity should return 400 if no data is provided', async () => {
        const res = await request(app).put('/activities/activity').send({})
    
        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Missing required fields for update" })
    })
})
