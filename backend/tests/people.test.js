const request = require('supertest')
const express = require('express')
const router = require('../routes/people')
const DBWrapper = require('../routes/db')

jest.mock('../routes/db') // Mock DBWrapper

const app = express()
app.use(express.json())
app.use('/people', router)

describe('People Routes', () => {
    let mockDB

    beforeEach(() => {
        // Mock DBWrapper functions
        mockDB = {
            addPerson: jest.fn().mockImplementation(async (person) => ({ ...person, _id: '12345' })),
            deletePerson: jest.fn().mockResolvedValue(true),
            getAllPeople: jest.fn().mockResolvedValue([
                { _id: '1', name: 'John Doe', username: 'johndoe', type: 'guest', unitsStayedIn: [], unitsOwned: [] }
            ]),
            getPersonById: jest.fn().mockResolvedValue({ _id: '1', name: 'John Doe' }),
            getPersonByUsername: jest.fn().mockResolvedValue({ _id: '2', username: 'johndoe' }),
            getUnitsOwned: jest.fn().mockResolvedValue(["unitA", "unitB"]),
            getUnitsStayedIn: jest.fn().mockResolvedValue(["unitX", "unitY"]),
            updatePerson: jest.fn().mockImplementation(async (person) => person._id ? { ...person } : null)
        }

        // Mock DBWrapper class implementation
        DBWrapper.mockImplementation(() => mockDB);
    })

    afterEach(() => {
        jest.clearAllMocks(); // Reset mocks after each test
    })

    test('POST /people should add a new person', async () => {
        const person = {
            name: 'Alice',
            username: 'alice123',
            password: 'password123',
            type: 'host',
            unitsStayedIn: ['unitX'],
            unitsOwned: ['unitA']
        }

        const res = await request(app).post('/people').send(person)
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ ...person, _id: '12345' })
        expect(mockDB.addPerson).toHaveBeenCalledWith(expect.objectContaining(person))
    })

    test('DELETE /people/person should delete a person', async () => {
        const res = await request(app).delete('/people/person').send({ _id: '12345' })

        expect(res.status).toBe(200)
        expect(res.body).toEqual({ message: "Person deleted Successfully" })
        expect(mockDB.deletePerson).toHaveBeenCalledWith({ _id: '12345' })
    })

    test('GET /people should return all people', async () => {
        const res = await request(app).get('/people')

        expect(res.status).toBe(200)
        expect(res.body).toEqual([
            { _id: '1', name: 'John Doe', username: 'johndoe', type: 'guest', unitsStayedIn: [], unitsOwned: [] }
        ])
        expect(mockDB.getAllPeople).toHaveBeenCalled()
    })

    test('GET /people/id should return a person by ID', async () => {
        const res = await request(app).get('/people/id').query({ _id: '1' })

        expect(res.status).toBe(200)
        expect(res.body).toEqual({ _id: '1', name: 'John Doe' })
        expect(mockDB.getPersonById).toHaveBeenCalledWith('1')
    })

    test('GET /people/username should return a person by username', async () => {
        const res = await request(app).get('/people/username').query({ username: 'johndoe' })

        expect(res.status).toBe(200)
        expect(res.body).toEqual({ _id: '2', username: 'johndoe' })
        expect(mockDB.getPersonByUsername).toHaveBeenCalledWith('johndoe')
    })

    test('GET /people/unitsOwned should return units owned by a user', async () => {
        const res = await request(app).get('/people/unitsOwned').query({ username: 'johndoe' })

        expect(res.status).toBe(200)
        expect(res.body).toEqual(["unitA", "unitB"])
        expect(mockDB.getUnitsOwned).toHaveBeenCalledWith('johndoe')
    })

    test('GET /people/unitsStayedIn should return units stayed in by a user', async () => {
        const res = await request(app).get('/people/unitsStayedIn').query({ username: 'johndoe' })

        expect(res.status).toBe(200)
        expect(res.body).toEqual(["unitX", "unitY"])
        expect(mockDB.getUnitsStayedIn).toHaveBeenCalledWith('johndoe')
    })

    test('PUT /people/person should update a person', async () => {
        const updatedPerson = {
            _id: '12345',
            name: 'Updated Alice',
            username: 'alice123',
            type: 'host',
            unitsStayedIn: ['unitY'],
            unitsOwned: ['unitA', 'unitB']
        }

        mockDB.updatePerson.mockResolvedValue(updatedPerson)

        const res = await request(app).put('/people/person').send(updatedPerson)

        expect(res.status).toBe(200)
        expect(res.body).toEqual(updatedPerson)
        expect(mockDB.updatePerson).toHaveBeenCalledWith(expect.objectContaining(updatedPerson))
    })

    test('PUT /people/person should return 400 if person not found', async () => {
        const updatedPerson = { _id: '99999', name: 'Nonexistent' }
        mockDB.updatePerson.mockResolvedValue(null)

        const res = await request(app).put('/people/person').send(updatedPerson)

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Person not found" })
        expect(mockDB.updatePerson).toHaveBeenCalledWith(expect.objectContaining(updatedPerson))
    })
})
