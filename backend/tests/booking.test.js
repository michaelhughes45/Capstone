const request = require('supertest');
const app = require('../server');
const Booking = require('../models/Booking');

jest.mock('../models/Booking');

describe('Booking Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /bookings/create', () => {
    it('should create a new booking', async () => {
      const mockBooking = {
        customerId: 'cust123',
        hostId: 'host456',
        listingId: 'list789',
        startDate: '2025-04-20',
        endDate: '2025-04-25',
        totalPrice: 800
      };
  
      // ✅ Fixed: booking object has .save() and the fields
      Booking.mockImplementation(() => {
        const booking = { ...mockBooking };
        booking.save = jest.fn().mockResolvedValue(booking);
        return booking;
      });
  
      const res = await request(app)
        .post('/bookings/create')
        .send(mockBooking)
        .set('Accept', 'application/json');
  
      expect(res.statusCode).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(res.body).toMatchObject(mockBooking);
    });
  });

  describe('GET /bookings/listing/:listingId', () => {
    it('should return bookings for a listing ID', async () => {
      const listingId = 'list123';
      const mockBookings = [
        { _id: 'booking1', listingId },
        { _id: 'booking2', listingId }
      ];

      Booking.find.mockResolvedValue(mockBookings);

      const res = await request(app).get(`/bookings/listing/${listingId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockBookings);
    });
  });

  describe('DELETE /bookings/:bookingId', () => {
    it('should delete a booking by ID', async () => {
      const bookingId = 'booking123';

      Booking.findByIdAndDelete.mockResolvedValue({ _id: bookingId });

      const res = await request(app).delete(`/bookings/${bookingId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Booking cancelled successfully');
    });
  });
});
