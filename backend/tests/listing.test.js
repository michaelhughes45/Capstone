const request = require('supertest');
const path = require('path');
const app = require('../server');
const Listing = require('../models/Listing');

jest.mock('../models/Listing');

// ✅ FIX: Fully mock multer including single() and array()
jest.mock('multer', () => {
  const multerMock = () => ({
    single: () => (req, res, next) => {
      req.file = { path: 'public/uploads/profile.jpg' };
      next();
    },
    array: () => (req, res, next) => {
      req.files = [
        { path: 'public/uploads/fake1.jpg' },
        { path: 'public/uploads/fake2.jpg' }
      ];
      next();
    }
  });
  multerMock.diskStorage = () => ({});
  return multerMock;
});

describe('Listing Routes - Happy Paths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /properties/create', () => {
    it('should create a new listing with photos', async () => {
      const mockListing = {
        creator: 'user123',
        category: 'beach',
        type: 'apartment',
        streetAddress: '123 Ocean Ave',
        aptSuite: 'Unit 5',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        guestCount: 4,
        bedroomCount: 2,
        bedCount: 2,
        bathroomCount: 1,
        amenities: ['wifi', 'ac'],
        title: 'Beachside Bliss',
        description: 'Cozy spot by the beach',
        highlight: 'Ocean View',
        highlightDesc: 'See the waves from your window',
        price: 300,
        listingPhotoPaths: ['public/uploads/fake1.jpg', 'public/uploads/fake2.jpg']
      };
  
      // ✅ Properly simulate Mongoose's toJSON()
    //   Listing.prototype.save = jest.fn().mockResolvedValue({
    //     toJSON: () => ({ ...mockListing }),
    //     toObject: () => ({ ...mockListing })
    //   });
      Listing.prototype.save = jest.fn().mockResolvedValue(mockListing);
  

      const res = await request(app)
        .post('/properties/create')
        .field('creator', mockListing.creator)
        .field('category', mockListing.category)
        .field('type', mockListing.type)
        .field('streetAddress', mockListing.streetAddress)
        .field('aptSuite', mockListing.aptSuite)
        .field('city', mockListing.city)
        .field('state', mockListing.state)
        .field('country', mockListing.country)
        .field('guestCount', mockListing.guestCount)
        .field('bedroomCount', mockListing.bedroomCount)
        .field('bedCount', mockListing.bedCount)
        .field('bathroomCount', mockListing.bathroomCount)
        .field('amenities', mockListing.amenities.join(','))
        .field('title', mockListing.title)
        .field('description', mockListing.description)
        .field('highlight', mockListing.highlight)
        .field('highlightDesc', mockListing.highlightDesc)
        .field('price', mockListing.price)
        .attach('listingPhotos', path.resolve(__dirname, 'dummy.jpg'));
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(mockListing);
    });
  });

  describe('GET /properties', () => {
    it('should fetch listings (optionally filtered by category)', async () => {
      const mockListings = [{ _id: '1', category: 'beach' }, { _id: '2', category: 'beach' }];
      Listing.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(mockListings) });

      const res = await request(app).get('/properties?category=beach');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockListings);
    });
  });

  describe('GET /properties/search/:search', () => {
    it('should return listings for a search term', async () => {
      const mockListings = [{ _id: '1', city: 'Miami' }];
      Listing.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(mockListings) });

      const res = await request(app).get('/properties/search/Miami');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockListings);
    });
  });

  describe('GET /properties/:listingId', () => {
    it('should return a specific listing by ID', async () => {
      const listingId = '123';
      const mockListing = { _id: listingId, city: 'Miami' };
      Listing.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockListing)
      });

      const res = await request(app).get(`/properties/${listingId}`);

      expect(res.statusCode).toBe(202);
      expect(res.body).toEqual(mockListing);
    });
  });
});
