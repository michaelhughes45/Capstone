const request = require('supertest')
const express = require('express')
const router = require('../routes/activities')
const DBWrapper = require('../routes/db')


jest.mock('../routes/db') // Mock DBWrapper

const app = express()
app.use(express.json())
app.use('/activities', router)

describe('Activity Routes', () => {
    let dbMock

    beforeEach(() => {
        dbMock = new DBWrapper()
        DBWrapper.mockImplementation(() => dbMock)
        jest.clearAllMocks()
    })

    test('POST /activities should add an activity', async () => {
        const mockActivity = {
            name: "Hiking",
            type: "Outdoor",
            description: "Mountain hiking",
            location: "Rocky Mountains",
            dateStart: "2025-06-01",
            dateEnd: "2025-06-02",
            hoursOpen: "6:00 AM - 8:00 PM"
        }
        dbMock.addActivity.mockResolvedValue({ ...mockActivity, _id: "12345" })

        const response = await request(app).post('/activities').send(mockActivity)

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ ...mockActivity, _id: "12345" })
        expect(dbMock.addActivity).toHaveBeenCalledWith(expect.objectContaining(mockActivity))
    })

    test('DELETE /activities/activity should delete an activity', async () => {
        dbMock.deleteActivity.mockResolvedValue(true)

        const response = await request(app).delete('/activities/activity').send({ _id: "12345" })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ message: "Activity deleted Successfully" })
        expect(dbMock.deleteActivity).toHaveBeenCalledWith({ _id: "12345" })
    })

    test('DELETE /activities/activity should return 404 if activity not found', async () => {
        dbMock.deleteActivity.mockResolvedValue(null)

        const response = await request(app).delete('/activities/activity').send({ _id: "12345" })

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ message: "Activity not found" })
    })

    test('GET /activities/type should return activities of a given type', async () => {
        const mockActivities = [{ name: "Hiking", type: "Outdoor" }]
        dbMock.getActivitiesByType.mockResolvedValue(mockActivities)

        const response = await request(app).get('/activities/type?type=Outdoor')

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockActivities)
        expect(dbMock.getActivitiesByType).toHaveBeenCalledWith("Outdoor")
    })

    test('GET /activities should return all activities', async () => {
        const mockActivities = [{ name: "Hiking" }, { name: "Swimming" }]
        dbMock.getAllActivities.mockResolvedValue(mockActivities)

        const response = await request(app).get('/activities')

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockActivities)
        expect(dbMock.getAllActivities).toHaveBeenCalled()
    })

    test('PUT /activities/activity should update an activity', async () => {
        const mockUpdatedActivity = { 
            _id: "12345", 
            name: "Updated Activity",
            type: "Outdoor",
            description: "Updated description",
            location: "Updated location",
            dateStart: "2025-06-01",
            dateEnd: "2025-06-02",
            hoursOpen: "8:00 AM - 6:00 PM"
        }
        dbMock.updateActivity.mockResolvedValue(mockUpdatedActivity)

        const response = await request(app).put('/activities/activity').send(mockUpdatedActivity)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockUpdatedActivity)
        expect(dbMock.updateActivity).toHaveBeenCalledWith(mockUpdatedActivity)
    })

    test('PUT /activities/activity should return 404 if activity not found', async () => {
        dbMock.updateActivity.mockResolvedValue(null)

        const response = await request(app).put('/activities/activity').send({
            _id: "99999", 
            name: "Nonexistent Activity",
            type: "Outdoor",
            description: "Some description",
            location: "Unknown",
            dateStart: "2025-06-01",
            dateEnd: "2025-06-02",
            hoursOpen: "10:00 AM - 5:00 PM"
        })

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ message: "Activity not found" })
    })
})
