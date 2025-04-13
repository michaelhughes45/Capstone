const request = require('supertest');
const app = require('../server');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const User = require('../models/User');

jest.mock('../models/Booking');
jest.mock('../models/Listing');
jest.mock('../models/User');

describe('User Routes - Sad Paths', () => {
  const userId = 'user123';
  const listingId = 'listing123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /users/:userId/trips - handles DB error', async () => {
    Booking.find.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValueOnce(new Error('DB error'))
    }));

    const res = await request(app).get(`/users/${userId}/trips`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/can not find trips/i);
  });

  it('GET /users/:userId/trips/current - handles DB error', async () => {
    Booking.find.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValueOnce(new Error('DB error'))
    }));

    const res = await request(app).get(`/users/${userId}/trips/current`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/cannot find current trips/i);
  });

  it('GET /users/:userId/trips/past - handles DB error', async () => {
    Booking.find.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValueOnce(new Error('DB error'))
    }));

    const res = await request(app).get(`/users/${userId}/trips/past`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/cannot find past trips/i);
  });

  it('PATCH /users/:userId/:listingId - handles listing lookup error', async () => {
    User.findById.mockResolvedValueOnce({ wishList: [], save: jest.fn() });
    Listing.findById.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValueOnce(new Error('Listing not found'))
    }));

    const res = await request(app).patch(`/users/${userId}/${listingId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/listing not found/i);
  });

  it('GET /users/:userId/properties - handles DB error', async () => {
    Listing.find.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValueOnce(new Error('DB error'))
    }));

    const res = await request(app).get(`/users/${userId}/properties`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/can not find properties/i);
  });

  it('GET /users/:userId/reservations - handles DB error', async () => {
    Booking.find.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValueOnce(new Error('DB error'))
    }));

    const res = await request(app).get(`/users/${userId}/reservations`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/can not find reservations/i);
  });

  it('GET /users/:userId/reservations/current - handles DB error', async () => {
    Booking.find.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValueOnce(new Error('DB error'))
    }));

    const res = await request(app).get(`/users/${userId}/reservations/current`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/cannot find current reservations/i);
  });

  it('GET /users/:userId/reservations/past - handles DB error', async () => {
    Booking.find.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValueOnce(new Error('DB error'))
    }));

    const res = await request(app).get(`/users/${userId}/reservations/past`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/cannot find past reservations/i);
  });
});
