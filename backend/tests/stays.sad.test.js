const request = require('supertest')
const express = require('express')
const router = require('../routes/stays')
const DBWrapper = require('../routes/db')

jest.mock('../routes/db') // Mock DBWrapper

const app = express()
app.use(express.json())
app.use('/stays', router)

describe('Stays Routes - Sad Path Tests', () => {
    let mockDB

    beforeEach(() => {
        mockDB = new DBWrapper()
        DBWrapper.mockImplementation(() => mockDB)
        jest.clearAllMocks()
    })

    // ❌ **POST /stays - Missing required fields**
    test('POST /stays should return 400 if required fields are missing', async () => {
        const res = await request(app).post('/stays').send({
            personId: "12345",
            ownerId: "67890"
            // Missing unitId, startDate, endDate, dates, paymentStatus, status
        })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Missing required fields" })
    })

    // ❌ **GET /stays/paymentStatus - No stays found**
    test('GET /stays/paymentStatus should return 404 if no stays exist for given paymentStatus', async () => {
        mockDB.getStaysByPaymentStatus.mockResolvedValue([])

        const res = await request(app).get('/stays/paymentStatus').query({ paymentStatus: "pending" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "No stays found with this payment status" })
    })

    // ❌ **GET /stays/paymentStatus - Missing query parameter**
    test('GET /stays/paymentStatus should return 400 if paymentStatus is not provided', async () => {
        const res = await request(app).get('/stays/paymentStatus')

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Payment status is required" })
    })

    // ❌ **GET /stays/ownerId - No stays found**
    test('GET /stays/ownerId should return 404 if no stays exist for given ownerId', async () => {
        mockDB.getStaysByOwnerId.mockResolvedValue([])

        const res = await request(app).get('/stays/ownerId').query({ ownerId: "unknown_owner" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "No stays found for this owner" })
    })

    // ❌ **GET /stays/personId - No stays found**
    test('GET /stays/personId should return 404 if no stays exist for given personId', async () => {
        mockDB.getStaysByPersonId.mockResolvedValue([])

        const res = await request(app).get('/stays/personId').query({ personId: "unknown_person" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "No stays found for this person" })
    })

    // ❌ **GET /stays/unitId - No stays found**
    test('GET /stays/unitId should return 404 if no stays exist for given unitId', async () => {
        mockDB.getStaysByUnitId.mockResolvedValue([])

        const res = await request(app).get('/stays/unitId').query({ unitId: "unknown_unit" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "No stays found for this unit" })
    })

    // ❌ **PUT /stays/stay - Updating non-existent stay**
    test('PUT /stays/stay should return 404 if stay does not exist', async () => {
        const updatedStay = {
            _id: '12345',
            personId: 'P1',
            ownerId: 'O1',
            unitId: 'U1',
            startDate: '2025-06-01',
            endDate: '2025-06-10',
            dates: ['2025-06-01', '2025-06-02'],
            paymentStatus: 'paid',
            status: 'completed'
        };
    
        mockDB.updateStay.mockResolvedValue(null); // Simulating stay not found
    
        const res = await request(app).put('/stays/stay').send(updatedStay);
    
        expect(res.status).toBe(404); // Expect 404 instead of 400
        expect(res.body).toEqual({ message: "Stay not found" });
        expect(mockDB.updateStay).toHaveBeenCalledWith(expect.objectContaining(updatedStay))
    })

    // ❌ **PUT /stays/stay - Missing required fields**
    test('PUT /stays/stay should return 400 if required fields are missing', async () => {
        const res = await request(app).put('/stays/stay').send({
            _id: "12345"
            // Missing status or other required fields
        })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Missing required fields for update" })
    })

    // ❌ **DELETE /stays/stay - Stay not found**
    test('DELETE /stays/stay should return 404 if stay does not exist', async () => {
        mockDB.deleteStay.mockResolvedValue(null)

        const res = await request(app).delete('/stays/stay').send({ _id: "99999" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "Stay not found" })
    })
})
