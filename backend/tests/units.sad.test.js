const request = require('supertest');
const express = require('express');
const unitsRouter = require('../routes/units');
const DBWrapper = require('../routes/db');

// Mock Express App
const app = express();
app.use(express.json());
app.use('/units', unitsRouter);

// Mock DBWrapper Methods
const mockDB = {
    addUnit: jest.fn(),
    deleteUnit: jest.fn(),
    getAllUnits: jest.fn(),
    getUnitById: jest.fn(),
    getUnitsByAddress: jest.fn(),
    getUnitsByNumberBedrooms: jest.fn(),
    getUnitsByNumberBedroomsHigh: jest.fn(),
    getUnitsByNumberBedroomsLow: jest.fn(),
    getUnitsByOwnerId: jest.fn(),
    getUnitsByPrice: jest.fn(),
    getUnitsByPriceHigh: jest.fn(),
    getUnitsByPriceLow: jest.fn(),
    getUnitsBySleeps: jest.fn(),
    getUnitsBySleepsHigh: jest.fn(),
    getUnitsBySleepsLow: jest.fn(),
    getUnitsByRating: jest.fn(),
    getUnitsByRatingHigh: jest.fn(),
    getUnitsByRatingLow: jest.fn(),
    getUnitsWithAmenitiesHotTub: jest.fn(),
    getUnitsWithAmenitiesHotTubAndPool: jest.fn(),
    getUnitsWithAmenitiesPool: jest.fn(),
    updateUnit: jest.fn()
};

// Mock DBWrapper in the route
jest.mock('../routes/db', () => {
    return jest.fn().mockImplementation(() => mockDB);
});

describe('Units Routes - Sad Path Tests', () => {

    // ❌ **POST /units - Missing required fields**
    test('POST /units should return 400 when required fields are missing', async () => {
        const res = await request(app).post('/units').send({});
        expect(res.status).toBe(400);
    });

    // ❌ **DELETE /units/unit - Non-existent unit**
    test('DELETE /units/unit should return 404 if unit does not exist', async () => {
        mockDB.deleteUnit.mockResolvedValue(null);
        const res = await request(app).delete('/units/unit').send({ _id: 'invalid' });
        expect(res.status).toBe(404);
    });

    // ❌ **GET /units/id - Unit not found**
    test('GET /units/id should return 404 when unit is not found', async () => {
        mockDB.getUnitById.mockResolvedValue(null);
        const res = await request(app).get('/units/id').query({ _id: 'invalid_id' });
        expect(res.status).toBe(404);
    });

    // ❌ **GET /units/address - Address not found**
    test('GET /units/address should return 404 when address is not found', async () => {
        mockDB.getUnitsByAddress.mockResolvedValue([]);
        const res = await request(app).get('/units/address').query({ address: 'Unknown Address' });
        expect(res.status).toBe(404);
    });

    // ❌ **GET /units/numberBedrooms - Invalid number format**
    test('GET /units/numberBedrooms should return 400 when number is invalid', async () => {
        const res = await request(app).get('/units/numberBedrooms').query({ numberBedrooms: 'invalid' });
        expect(res.status).toBe(400);
    });

    // ❌ **GET /units/numberBedrooms/high - No results**
    test('GET /units/numberBedrooms/high should return 404 if no units exist', async () => {
        mockDB.getUnitsByNumberBedroomsHigh.mockResolvedValue([]);
        const res = await request(app).get('/units/numberBedrooms/high');
        expect(res.status).toBe(404);
    });

    // ❌ **GET /units/numberBedrooms/low - No results**
    test('GET /units/numberBedrooms/low should return 404 if no units exist', async () => {
        mockDB.getUnitsByNumberBedroomsLow.mockResolvedValue([]);
        const res = await request(app).get('/units/numberBedrooms/low');
        expect(res.status).toBe(404);
    });

    // ❌ **GET /units/price - Invalid price format**
    test('GET /units/price should return 400 when price is invalid', async () => {
        const res = await request(app).get('/units/price').query({ price: 'invalid' });
        expect(res.status).toBe(400);
    });

    // ❌ **GET /units/price/high - No results**
    test('GET /units/price/high should return 404 if no units exist', async () => {
        mockDB.getUnitsByPriceHigh.mockResolvedValue([]);
        const res = await request(app).get('/units/price/high');
        expect(res.status).toBe(404);
    });

    // ❌ **GET /units/price/low - No results**
    test('GET /units/price/low should return 404 if no units exist', async () => {
        mockDB.getUnitsByPriceLow.mockResolvedValue([]);
        const res = await request(app).get('/units/price/low');
        expect(res.status).toBe(404);
    });

    // ❌ **GET /units/sleeps - Invalid number**
    test('GET /units/sleeps should return 400 when sleeps is not a number', async () => {
        const res = await request(app).get('/units/sleeps').query({ sleeps: 'invalid' });
        expect(res.status).toBe(400);
    });

    // ❌ **GET /units/rating - Invalid rating format**
    test('GET /units/rating should return 400 when rating is not a valid number', async () => {
        const res = await request(app).get('/units/rating').query({ rating: 'invalid' });
        expect(res.status).toBe(400);
    });

    // ❌ **GET /units/rating/high - No results**
    test('GET /units/rating/high should return 404 if no units exist', async () => {
        mockDB.getUnitsByRatingHigh.mockResolvedValue([]);
        const res = await request(app).get('/units/rating/high');
        expect(res.status).toBe(404);
    });

    // ❌ **GET /units/rating/low - No results**
    test('GET /units/rating/low should return 404 if no units exist', async () => {
        mockDB.getUnitsByRatingLow.mockResolvedValue([]);
        const res = await request(app).get('/units/rating/low');
        expect(res.status).toBe(404);
    });

    // ❌ **GET /units/address/hotTub - No results**
    test('GET /units/address/hotTub should return 404 if no units with hot tub exist', async () => {
        mockDB.getUnitsWithAmenitiesHotTub.mockResolvedValue([]);
        const res = await request(app).get('/units/address/hotTub');
        expect(res.status).toBe(404);
    });

    // ❌ **GET /units/address/hotTubPool - No results**
    test('GET /units/address/hotTubPool should return 404 if no units have both amenities', async () => {
        mockDB.getUnitsWithAmenitiesHotTubAndPool.mockResolvedValue([]);
        const res = await request(app).get('/units/address/hotTubPool');
        expect(res.status).toBe(404);
    });

    // ❌ **GET /units/address/pool - No results**
    test('GET /units/address/pool should return 404 if no units with a pool exist', async () => {
        mockDB.getUnitsWithAmenitiesPool.mockResolvedValue([]);
        const res = await request(app).get('/units/address/pool');
        expect(res.status).toBe(404);
    });

    // ❌ **PUT /units/unit - Updating a non-existent unit**
    test('PUT /units/unit should return 400 when updating a non-existent unit', async () => {
        mockDB.updateUnit.mockResolvedValue(null);
        const res = await request(app).put('/units/unit').send({ _id: 'invalid' });
        expect(res.status).toBe(400);
    });

});
