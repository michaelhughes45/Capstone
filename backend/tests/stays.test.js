const request = require('supertest');
const express = require('express');
const router = require('../routes/stays');
const DBWrapper = require('../routes/db');

jest.mock('../routes/db'); // Mock DBWrapper

const app = express();
app.use(express.json());
app.use('/stays', router);

describe('Stays Routes', () => {
    let mockDB;

    beforeEach(() => {
        // Mock DBWrapper functions
        mockDB = {
            addStay: jest.fn().mockImplementation(async (stay) => ({ ...stay, _id: '12345' })),
            deleteStay: jest.fn().mockResolvedValue(true),
            getAllStays: jest.fn().mockResolvedValue([
                { _id: '1', personId: 'P1', ownerId: 'O1', unitId: 'U1', paymentStatus: 'paid', status: 'completed' }
            ]),
            getStaysByPaymentStatus: jest.fn().mockResolvedValue([
                { _id: '2', paymentStatus: 'pending' }
            ]),
            getStaysByOwnerId: jest.fn().mockResolvedValue([
                { _id: '3', ownerId: 'O1' }
            ]),
            getStaysByPersonId: jest.fn().mockResolvedValue([
                { _id: '4', personId: 'P1' }
            ]),
            getStaysByUnitId: jest.fn().mockResolvedValue([
                { _id: '5', unitId: 'U1' }
            ]),
            updateStay: jest.fn().mockImplementation(async (stay) => stay._id ? { ...stay } : null)
        };

        // Mock DBWrapper class implementation
        DBWrapper.mockImplementation(() => mockDB);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Reset mocks after each test
    });

    test('POST /stays should add a new stay', async () => {
        const stay = {
            personId: 'P1',
            ownerId: 'O1',
            unitId: 'U1',
            startDate: '2025-06-01',
            endDate: '2025-06-10',
            dates: ['2025-06-01', '2025-06-02'],
            paymentStatus: 'pending',
            status: 'confirmed'
        };

        const res = await request(app).post('/stays').send(stay);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ...stay, _id: '12345' });
        expect(mockDB.addStay).toHaveBeenCalledWith(expect.objectContaining(stay));
    });

    test('DELETE /stays/stay should delete a stay', async () => {
        const res = await request(app).delete('/stays/stay').send({ _id: '12345' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Stay deleted Successfully" });
        expect(mockDB.deleteStay).toHaveBeenCalledWith({ _id: '12345' });
    });

    test('GET /stays should return all stays', async () => {
        const res = await request(app).get('/stays');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { _id: '1', personId: 'P1', ownerId: 'O1', unitId: 'U1', paymentStatus: 'paid', status: 'completed' }
        ]);
        expect(mockDB.getAllStays).toHaveBeenCalled();
    });

    test('GET /stays/paymentStatus should return stays by payment status', async () => {
        const res = await request(app).get('/stays/paymentStatus').query({ paymentStatus: 'pending' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ _id: '2', paymentStatus: 'pending' }]);
        expect(mockDB.getStaysByPaymentStatus).toHaveBeenCalledWith('pending');
    });

    test('GET /stays/ownerId should return stays by ownerId', async () => {
        const res = await request(app).get('/stays/ownerId').query({ ownerId: 'O1' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ _id: '3', ownerId: 'O1' }]);
        expect(mockDB.getStaysByOwnerId).toHaveBeenCalledWith('O1');
    });

    test('GET /stays/personId should return stays by personId', async () => {
        const res = await request(app).get('/stays/personId').query({ personId: 'P1' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ _id: '4', personId: 'P1' }]);
        expect(mockDB.getStaysByPersonId).toHaveBeenCalledWith('P1');
    });

    test('GET /stays/unitId should return stays by unitId', async () => {
        const res = await request(app).get('/stays/unitId').query({ unitId: 'U1' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ _id: '5', unitId: 'U1' }]);
        expect(mockDB.getStaysByUnitId).toHaveBeenCalledWith('U1');
    });

    test('PUT /stays/stay should update a stay', async () => {
        const updatedStay = {
            _id: '12345',
            personId: 'P1',
            ownerId: 'O1',
            unitId: 'U1',
            paymentStatus: 'paid',
            status: 'completed'
        };

        mockDB.updateStay.mockResolvedValue(updatedStay);

        const res = await request(app).put('/stays/stay').send(updatedStay);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(updatedStay);
        expect(mockDB.updateStay).toHaveBeenCalledWith(expect.objectContaining(updatedStay));
    });

    test('PUT /stays/stay should return 400 if stay not found', async () => {
        const updatedStay = { _id: '99999', personId: 'P9' };
        mockDB.updateStay.mockResolvedValue(null);

        const res = await request(app).put('/stays/stay').send(updatedStay);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Stay not found" });
        expect(mockDB.updateStay).toHaveBeenCalledWith(expect.objectContaining(updatedStay));
    });
});
