const request = require('supertest');
const path = require('path');
const Listing = require('../models/Listing');

jest.mock('../models/Listing');

// ✅ Proper multer mock that supports both .array() and .single()
jest.mock('multer', () => {
  const multer = () => ({
    single: () => (req, res, next) => {
      req.file = undefined;
      next();
    },
    array: () => (req, res, next) => {
      req.files = undefined;
      next();
    }
  });

  multer.diskStorage = () => ({
    _handleFile: jest.fn(),
    _removeFile: jest.fn()
  });

  return multer;
});

// ✅ Require server AFTER all jest.mocks to ensure correct multer usage
const app = require('../server');

describe('Listing Routes - Sad Paths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /properties/create', () => {
    it('should fail when no files are uploaded', async () => {
      const res = await request(app)
        .post('/properties/create')
        .field('creator', 'user123')
        .field('title', 'Test Listing');

      expect(res.statusCode).toBe(400);
      expect(res.text).toBe("No file uploaded.");
    });

    it('should handle DB error on save', async () => {
        jest.resetModules(); // make sure server reloads with fresh mocks
      
        jest.doMock('multer', () => {
          const multer = () => ({
            array: () => (req, res, next) => {
              req.files = [{ path: 'dummy/path.jpg' }]; // simulate successful upload
              next();
            },
            single: () => (req, res, next) => {
              req.file = undefined;
              next();
            }
          });
      
          multer.diskStorage = () => ({
            _handleFile: jest.fn(),
            _removeFile: jest.fn()
          });
      
          return multer;
        });
      
        const Listing = require('../models/Listing');
        Listing.prototype.save = jest.fn().mockRejectedValue(new Error('DB error'));
      
        const appWithMock = require('../server'); // must be after doMock
      
        const res = await request(appWithMock)
          .post('/properties/create')
          .field('creator', 'user123')
          .field('title', 'Test Listing')
          .attach('listingPhotos', path.resolve(__dirname, 'dummy.jpg'));
      
        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('message', 'Fail to create Listing');
    });
      
  });

  describe('GET /properties', () => {
    it('should handle DB error when fetching listings', async () => {
      Listing.find = jest.fn(() => ({
        populate: jest.fn().mockRejectedValue(new Error('Category error'))
      }));

      const res = await request(app).get('/properties?category=beach');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Fail to fetch listings');
    });
  });

  describe('GET /properties/search/:search', () => {
    it('should handle DB error when searching listings', async () => {
      Listing.find = jest.fn(() => ({
        populate: jest.fn().mockRejectedValue(new Error('Search error'))
      }));

      const res = await request(app).get('/properties/search/Miami');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Fail to fetch listings');
    });
  });

  describe('GET /properties/:listingId', () => {
    it('should handle error for invalid listing ID', async () => {
      Listing.findById = jest.fn(() => ({
        populate: jest.fn().mockRejectedValue(new Error('DB error'))
      }));

      const res = await request(app).get('/properties/507f1f77bcf86cd799439011');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Listing can not found!');
    });
  });
});
