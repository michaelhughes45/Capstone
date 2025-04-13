const request = require("supertest");
const app = require("../server");
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const User = require("../models/User");

jest.mock("../models/Booking");
jest.mock("../models/Listing");
jest.mock("../models/User");

const dummyUserId = "user123";
const dummyListingId = "listing123";
const today = new Date();
const pastDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString();
const futureDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString();

const dummyBooking = {
  _id: "booking123",
  customerId: dummyUserId,
  hostId: "host456",
  listingId: dummyListingId,
  endDate: futureDate,
  populate() {
    return Promise.resolve(this);
  }
};

const dummyListing = {
  _id: dummyListingId,
  title: "Sample Listing",
  creator: dummyUserId,
  populate() {
    return Promise.resolve(this);
  }
};

const dummyUser = {
  _id: dummyUserId,
  wishList: [],
  save: jest.fn().mockResolvedValue(true)
};

describe("User Routes - Happy Paths", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /users/:userId/trips returns trips", async () => {
    Booking.find.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce([dummyBooking])
    });
    const res = await request(app).get(`/users/${dummyUserId}/trips`);
    expect(res.statusCode).toBe(202);
    expect(res.body).toEqual(expect.any(Array));
  });

  test("GET /users/:userId/trips/current returns current trips", async () => {
    Booking.find.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce([{ ...dummyBooking, endDate: futureDate }])
    });
    const res = await request(app).get(`/users/${dummyUserId}/trips/current`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("GET /users/:userId/trips/past returns past trips", async () => {
    Booking.find.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce([{ ...dummyBooking, endDate: pastDate }])
    });
    const res = await request(app).get(`/users/${dummyUserId}/trips/past`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("PATCH /users/:userId/:listingId toggles wishlist (add)", async () => {
    User.findById.mockResolvedValueOnce({ ...dummyUser, wishList: [], save: jest.fn().mockResolvedValue(true) });
    Listing.findById.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(dummyListing)
    });

    const res = await request(app).patch(`/users/${dummyUserId}/${dummyListingId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/added/i);
  });

  test("PATCH /users/:userId/:listingId toggles wishlist (remove)", async () => {
    User.findById.mockResolvedValueOnce({
      ...dummyUser,
      wishList: [dummyListing],
      save: jest.fn().mockResolvedValue(true)
    });
    Listing.findById.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(dummyListing)
    });

    const res = await request(app).patch(`/users/${dummyUserId}/${dummyListingId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/removed/i);
  });

  test("GET /users/:userId/properties returns properties", async () => {
    Listing.find.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce([dummyListing])
    });

    const res = await request(app).get(`/users/${dummyUserId}/properties`);
    expect(res.statusCode).toBe(202);
    expect(res.body).toEqual(expect.any(Array));
  });

  test("GET /users/:userId/reservations returns reservations", async () => {
    Booking.find.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce([dummyBooking])
    });

    const res = await request(app).get(`/users/${dummyUserId}/reservations`);
    expect(res.statusCode).toBe(202);
    expect(res.body).toEqual(expect.any(Array));
  });

  test("GET /users/:userId/reservations/current returns current reservations", async () => {
    Booking.find.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce([{ ...dummyBooking, endDate: futureDate }])
    });

    const res = await request(app).get(`/users/${dummyUserId}/reservations/current`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("GET /users/:userId/reservations/past returns past reservations", async () => {
    Booking.find.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce([{ ...dummyBooking, endDate: pastDate }])
    });

    const res = await request(app).get(`/users/${dummyUserId}/reservations/past`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
});
