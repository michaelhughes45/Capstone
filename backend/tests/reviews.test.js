const request = require('supertest');
const express = require('express');
const router = require('../routes/reviews');
const DBWrapper = require('../routes/db'); // Import the DB wrapper

jest.mock('../routes/db'); // Ensure DBWrapper is mocked

const app = express();
app.use(express.json()); 
app.use('/reviews', router);

describe('Reviews Routes', () => {
    let mockDB;

    beforeEach(() => {
        // Ensure a fresh instance of the mock for each test
        mockDB = {
            getAllReviews: jest.fn().mockResolvedValue([
                { _id: '1', name: 'John Doe', reviewText: 'Great!', rating: 5, verified: false }
            ]),
            getReviewsByNameId: jest.fn().mockResolvedValue([
                { _id: '2', nameId: '123', reviewText: 'Nice!', rating: 4, verified: false }
            ]),
            getReviewsByUnitId: jest.fn().mockResolvedValue([
                { _id: '3', unitId: '456', reviewText: 'Awesome!', rating: 5, verified: false }
            ]),
            addReview: jest.fn().mockImplementation(async (review) => {
                const newReview =  { ...review, _id: '4' }
                console.log('Mock addReview returning:', newReview); // Debugging
                return newReview;
            }),
            deleteReview: jest.fn().mockResolvedValue(async (review) => {
                console.log('Mock deleteReview called with:', review); // Debugging
                if (!review._id) return false; // Simulate missing ID case
                return true; // Simulate successful delete
            }),
            updateVerification: jest.fn().mockImplementation(async (review) => {
                return { ...review, verified: true }
            })
        };

        // Ensure the DBWrapper mock is properly used
        DBWrapper.mockImplementation(() => mockDB);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Ensure each test starts with a clean slate
    });

    test('GET /reviews should return all reviews', async () => {
        const res = await request(app).get('/reviews');
        console.log('Response from GET /reviews:', res.body); // Debugging
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ _id: '1', name: 'John Doe', reviewText: 'Great!', rating: 5, verified: false }]);
        expect(mockDB.getAllReviews).toHaveBeenCalled();
    });

    test('GET /reviews/nameId should return reviews by nameId', async () => {
        const res = await request(app).get('/reviews/nameId').query({ nameId: '123' });
        console.log('Response from GET /reviews/nameId:', res.body); // Debugging
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ _id: '2', nameId: '123', reviewText: 'Nice!', rating: 4, verified: false }]);
        expect(mockDB.getReviewsByNameId).toHaveBeenCalledWith('123');
    });

    test('GET /reviews/unitId should return reviews by unitId', async () => {
        const res = await request(app).get('/reviews/unitId').query({ unitId: '456' });
        console.log('Response from GET /reviews/unitId:', res.body); // Debugging
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ _id: '3', unitId: '456', reviewText: 'Awesome!', rating: 5, verified: false }]);
        expect(mockDB.getReviewsByUnitId).toHaveBeenCalledWith('456');
    });

    test('POST /reviews should add a new review', async () => {
        const review = { unitId: '456', name: 'Alice', nameId: '789', reviewText: 'Fantastic!', rating: 5, verified: false };
        const res = await request(app).post('/reviews').send(review);
        console.log('Response from POST /reviews:', res.body); // Debugging
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ...review, _id: '4' });
        expect(mockDB.addReview).toHaveBeenCalledWith(expect.objectContaining(review));
    });

    test('DELETE /reviews/review should delete a review', async () => {
        const review = { _id: '4', unitId: '456', name: 'Alice', nameId: '789', reviewText: 'Fantastic!', rating: 5, verified: false };
        const res = await request(app).delete('/reviews/review').send(review);
        console.log('Response from DELETE /reviews/review:', res.body); // Debugging
        expect(res.status).toBe(200);
        expect(mockDB.deleteReview).toHaveBeenCalledWith(expect.objectContaining(review));
    });
});
