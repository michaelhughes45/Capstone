const request = require('supertest')
const express = require('express')
const router = require('../routes/people')
const DBWrapper = require('../routes/db')

jest.mock('../routes/db')

const app = express()
app.use(express.json())
app.use('/people', router)

describe('People Routes - Sad Path Tests', () => {
    let mockDB

    beforeEach(() => {
        mockDB = new DBWrapper()
        DBWrapper.mockImplementation(() => mockDB)
        jest.clearAllMocks()
    })

    test('POST /people should return 400 if required fields are missing', async () => {
        const res = await request(app).post('/people').send({
            username: "john_doe"
        })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Missing required fields" })
    })

    test('GET /people/id should return 404 if person is not found', async () => {
        mockDB.getPersonById.mockResolvedValue(null)

        const res = await request(app).get('/people/id').query({ _id: "unknown_id" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "Person not found" })
    })

    test('GET /people/username should return 404 if username does not exist', async () => {
        mockDB.getPersonByUsername.mockResolvedValue(null)

        const res = await request(app).get('/people/username').query({ username: "nonexistentuser" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "Person not found" })
    })

    test('GET /people/unitsOwned should return 404 if person owns no units', async () => {
        mockDB.getUnitsOwned.mockResolvedValue([])

        const res = await request(app).get('/people/unitsOwned').query({ username: "johndoe" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "No units owned by this user" })
    })

    test('GET /people/unitsStayedIn should return 404 if person has not stayed anywhere', async () => {
        mockDB.getUnitsStayedIn.mockResolvedValue([])

        const res = await request(app).get('/people/unitsStayedIn').query({ username: "johndoe" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "No units stayed in by this user" })
    })

    test('PUT /people/person should return 404 if person is not found', async () => {
        mockDB.updatePerson.mockResolvedValue(null)

        const res = await request(app).put('/people/person').send({ _id: "unknown_id", name: "New Name" })

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "Person not found" })
    })

    test('PUT /people/person should return 400 if required fields are missing', async () => {
        const res = await request(app).put('/people/person').send({})

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Missing person ID" })
    })
})
