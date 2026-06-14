const request = require('supertest');
const app = require('../server');
const Booking = require('../models/Booking');

jest.mock('../models/Booking');

describe('Booking Routes - Sad Paths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /bookings/create', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/bookings/create')
        .send({})
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Fail to create a new Booking!');
    });

    it('should handle server errors during creation', async () => {
      Booking.prototype.save = jest.fn().mockRejectedValue(new Error('Save failed'));

      const res = await request(app)
        .post('/bookings/create')
        .send({
          customerId: 'cust123',
          hostId: 'host456',
          listingId: 'list789',
          startDate: '2025-04-20',
          endDate: '2025-04-25',
          totalPrice: 800
        })
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Fail to create a new Booking!');
    });
  });

  describe('GET /bookings/listing/:listingId', () => {
    it('should return 404 if no bookings found', async () => {
      Booking.find.mockResolvedValue([]);

      const res = await request(app).get('/bookings/listing/invalidListing');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'No bookings found for this listing');
    });

    it('should handle server errors when retrieving', async () => {
      Booking.find.mockRejectedValue(new Error('DB failure'));

      const res = await request(app).get('/bookings/listing/anyListing');

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('message', 'Failed to retrieve bookings');
    });
  });

  describe('DELETE /bookings/:bookingId', () => {
    it('should return 404 if booking not found', async () => {
      Booking.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete('/bookings/nonexistentBooking');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Booking not found');
    });

    it('should handle server errors when deleting', async () => {
      Booking.findById.mockResolvedValue({ _id: 'failingDelete', isSeeded: false });
      Booking.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

      const res = await request(app).delete('/bookings/failingDelete');

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('message', 'Failed to cancel booking');
    });
  });
});
