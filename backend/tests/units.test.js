const request = require('supertest');
const express = require('express');
const router = require('../routes/units');
const DBWrapper = require('../routes/db');

jest.mock('../routes/db'); // Mock the database wrapper

const app = express();
app.use(express.json());
app.use('/units', router);

describe('Units Routes', () => {
    let mockDB;

    beforeEach(() => {
        mockDB = {
            addUnit: jest.fn().mockResolvedValue({ _id: '12345', ownerId: 'O1', address: '123 Main St', unitNumber: 'A1', numberBedrooms: 2, datesOccupied: ['date'], sleeps: 4, price: 100, rating: 4.5, shortDescription: 'Nice unit', description: 'Full description', amenities: ['hotTub'] }),
            deleteUnit: jest.fn().mockResolvedValue(true),
            getAllUnits: jest.fn().mockResolvedValue([{ _id: '12345', address: '123 Main St' }]),
            getUnitById: jest.fn().mockResolvedValue({ _id: '12345', address: '123 Main St' }),
            getUnitsByAddress: jest.fn().mockResolvedValue([{ _id: '12345', address: '123 Main St' }]),
            getUnitsByNumberBedrooms: jest.fn().mockResolvedValue([{ _id: '12345', numberBedrooms: 2 }]),
            getUnitsByNumberBedroomsHigh: jest.fn().mockResolvedValue([{ _id: '12345', numberBedrooms: 3 }]),
            getUnitsByNumberBedroomsLow: jest.fn().mockResolvedValue([{ _id: '12345', numberBedrooms: 1 }]),
            getUnitsByPrice: jest.fn().mockResolvedValue([{ _id: '12345', price: 100 }]),
            getUnitsByPriceHigh: jest.fn().mockResolvedValue([{ _id: '12345', price: 300 }]),
            getUnitsByPriceLow: jest.fn().mockResolvedValue([{ _id: '12345', price: 50 }]),
            getUnitsByRatingHigh: jest.fn().mockResolvedValue([{ _id: '12345', rating: 5 }]),
            getUnitsByRatingLow: jest.fn().mockResolvedValue([{ _id: '12345', rating: 3 }]),
            getUnitsWithAmenitiesHotTub: jest.fn().mockResolvedValue([
                { _id: '1', address: '123 Main St', amenities: ['hotTub', 'pool'] },
                { _id: '2', address: '456 Ocean Ave', amenities: ['hotTub'] }
            ]),
            getUnitsWithAmenitiesHotTubAndPool: jest.fn().mockResolvedValue([{ _id: '12345', amenities: ['hotTub', 'pool'] }]), // ✅ Fix function name
            getUnitsWithAmenitiesPool: jest.fn().mockResolvedValue([{ _id: '12345', amenities: ['pool'] }]), // ✅ Fix function name
            updateUnit: jest.fn().mockResolvedValue({ _id: '12345', numberBedrooms: 3 }),
        };

        DBWrapper.mockImplementation(() => mockDB);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ✅ POST /units (addUnit)
    test('POST /units should add a new unit', async () => {
        const unit = { ownerId: 'O1', address: '123 Main St', unitNumber: 'A1', numberBedrooms: 2, datesOccupied: ['date'], sleeps: 4, price: 100, rating: 4.5, shortDescription: 'Nice unit', description: 'Full description', amenities: ['hotTub'] };
        const res = await request(app).post('/units').send(unit);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ...unit, _id: '12345' });
        expect(mockDB.addUnit).toHaveBeenCalledWith(expect.objectContaining(unit));
    });

    // ✅ DELETE /units/unit (deleteUnit)
    test('DELETE /units/unit should delete a unit', async () => {
        const unit = { _id: '12345' };
        const res = await request(app).delete('/units/unit').send(unit);
        expect(res.status).toBe(200);
        expect(mockDB.deleteUnit).toHaveBeenCalledWith(expect.objectContaining(unit));
    });

    // ✅ GET /units (getAllUnits)
    test('GET /units should return all units', async () => {
        const res = await request(app).get('/units');
        expect(res.status).toBe(200);
        expect(mockDB.getAllUnits).toHaveBeenCalled();
    });

    // ✅ GET /units/id (getUnitById)
    test('GET /units/id should return a unit by ID', async () => {
        const res = await request(app).get('/units/id').query({ _id: '12345' });
        expect(res.status).toBe(200);
        expect(mockDB.getUnitById).toHaveBeenCalledWith('12345');
    });

    // ✅ GET /units/address (getUnitsByAddress)
    test('GET /units/address should return units by address', async () => {
        const res = await request(app).get('/units/address').query({ address: '123 Main St' });
        expect(res.status).toBe(200);
        expect(mockDB.getUnitsByAddress).toHaveBeenCalledWith('123 Main St');
    });

    // ✅ GET /units/numberBedrooms/high
    test('GET /units/numberBedrooms/high should return units sorted by bedrooms (high to low)', async () => {
        const res = await request(app).get('/units/numberBedrooms/high');
        expect(res.status).toBe(200);
        expect(mockDB.getUnitsByNumberBedroomsHigh).toHaveBeenCalled();
    });

    // ✅ GET /units/numberBedrooms/low
    test('GET /units/numberBedrooms/low should return units sorted by bedrooms (low to high)', async () => {
        const res = await request(app).get('/units/numberBedrooms/low');
        expect(res.status).toBe(200);
        expect(mockDB.getUnitsByNumberBedroomsLow).toHaveBeenCalled();
    });

    // ✅ GET /units/price
    test('GET /units/price should return units by price', async () => {
        const res = await request(app).get('/units/price').query({ price: 100 });
        expect(res.status).toBe(200);
        expect(mockDB.getUnitsByPrice).toHaveBeenCalledWith(100);
    });

    // ✅ GET /units/price/high
    test('GET /units/price/high should return units sorted by price (high to low)', async () => {
        const res = await request(app).get('/units/price/high');
        expect(res.status).toBe(200);
        expect(mockDB.getUnitsByPriceHigh).toHaveBeenCalled();
    });

    // ✅ GET /units/price/low
    test('GET /units/price/low should return units sorted by price (low to high)', async () => {
        const res = await request(app).get('/units/price/low');
        expect(res.status).toBe(200);
        expect(mockDB.getUnitsByPriceLow).toHaveBeenCalled();
    });

    // ✅ GET /units/rating/high
    test('GET /units/rating/high should return units sorted by rating (high to low)', async () => {
        const res = await request(app).get('/units/rating/high');
        expect(res.status).toBe(200);
        expect(mockDB.getUnitsByRatingHigh).toHaveBeenCalled();
    });

    // ✅ GET /units/rating/low
    test('GET /units/rating/low should return units sorted by rating (low to high)', async () => {
        const res = await request(app).get('/units/rating/low');
        expect(res.status).toBe(200);
        expect(mockDB.getUnitsByRatingLow).toHaveBeenCalled();
    });

    test('GET /units/address/hotTub should return units with a hot tub', async () => {
        const res = await request(app).get('/units/address/hotTub');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { _id: '1', address: '123 Main St', amenities: ['hotTub', 'pool'] },
            { _id: '2', address: '456 Ocean Ave', amenities: ['hotTub'] }
        ]);
        expect(mockDB.getUnitsWithAmenitiesHotTub).toHaveBeenCalled();
    });

    // ✅ GET /units/address/hotTubPool
    test('GET /units/address/hotTubPool should return units with both hot tub and pool', async () => {
        const res = await request(app).get('/units/address/hotTubPool');
        expect(res.status).toBe(200);
        expect(mockDB.getUnitsWithAmenitiesHotTubAndPool).toHaveBeenCalled();
    });

    // ✅ GET /units/address/pool
    test('GET /units/address/pool should return units with a pool', async () => {
        const res = await request(app).get('/units/address/pool');
        expect(res.status).toBe(200);
        expect(mockDB.getUnitsWithAmenitiesPool).toHaveBeenCalled();
    });
});
