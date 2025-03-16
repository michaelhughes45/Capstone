const request = require('supertest');
const express = require('express');
const router = require('../routes/pictures');
const DBWrapper = require('../routes/db');

jest.mock('../routes/db'); // Mock DBWrapper

const app = express();
app.use(express.json());
app.use('/pictures', router);

describe('Pictures Routes', () => {
    let mockDB;

    beforeEach(() => {
        // Mock DBWrapper functions
        mockDB = {
            addPicture: jest.fn().mockImplementation(async (picture) => ({ ...picture, _id: '12345' })),
            deletePicture: jest.fn().mockResolvedValue(true),
            getAllPictures: jest.fn().mockResolvedValue([
                { _id: '1', unitId: 'U1', pictureUrl: 'http://image.com/1.jpg', displayOrder: 1 }
            ]),
            getPicturesByUnitId: jest.fn().mockResolvedValue([
                { _id: '2', unitId: 'U1', pictureUrl: 'http://image.com/2.jpg', displayOrder: 2 }
            ]),
            updatePicture: jest.fn().mockImplementation(async (picture) => picture._id ? { ...picture } : null)
        };

        // Mock DBWrapper class implementation
        DBWrapper.mockImplementation(() => mockDB);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Reset mocks after each test
    });

    test('POST /pictures should add a new picture', async () => {
        const picture = {
            unitId: 'U1',
            pictureUrl: 'http://image.com/new.jpg',
            displayOrder: 3
        };

        const res = await request(app).post('/pictures').send(picture);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ...picture, _id: '12345' });
        expect(mockDB.addPicture).toHaveBeenCalledWith(expect.objectContaining(picture));
    });

    test('DELETE /pictures/picture should delete a picture', async () => {
        const res = await request(app).delete('/pictures/picture').send({ _id: '12345' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Picture deleted Successfully" });
        expect(mockDB.deletePicture).toHaveBeenCalledWith({ _id: '12345' });
    });

    test('GET /pictures should return all pictures', async () => {
        const res = await request(app).get('/pictures');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { _id: '1', unitId: 'U1', pictureUrl: 'http://image.com/1.jpg', displayOrder: 1 }
        ]);
        expect(mockDB.getAllPictures).toHaveBeenCalled();
    });

    test('GET /pictures/unitId should return pictures by unitId', async () => {
        const res = await request(app).get('/pictures/unitId').query({ unitId: 'U1' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ _id: '2', unitId: 'U1', pictureUrl: 'http://image.com/2.jpg', displayOrder: 2 }]);
        expect(mockDB.getPicturesByUnitId).toHaveBeenCalledWith('U1');
    });

    test('PUT /pictures/picture should update a picture', async () => {
        const updatedPicture = {
            _id: '12345',
            unitId: 'U1',
            pictureUrl: 'http://image.com/updated.jpg',
            displayOrder: 4
        };

        mockDB.updatePicture.mockResolvedValue(updatedPicture);

        const res = await request(app).put('/pictures/picture').send(updatedPicture);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(updatedPicture);
        expect(mockDB.updatePicture).toHaveBeenCalledWith(expect.objectContaining(updatedPicture));
    });

    test('PUT /pictures/picture should return 404 if picture not found', async () => {
        mockDB.updatePicture.mockResolvedValue(null);

        const updatedPicture = {
            _id: "non_existent_id",
            pictureUrl: "https://example.com/new_image.jpg",
            displayOrder: 2
        };
    
        const res = await request(app).put('/pictures/picture').send(updatedPicture);
    
        console.log("Test Response Status:", res.status);  // Debugging line
        console.log("Test Response Body:", res.body);  // Debugging line
    
        expect(res.status).toBe(404);  // Ensure test expects 404
        expect(res.body).toEqual({ message: "picture not found" });  // Ensure correct error message
        expect(mockDB.updatePicture).toHaveBeenCalledWith(expect.objectContaining(updatedPicture));
    });
});
