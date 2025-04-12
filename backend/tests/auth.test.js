const request = require('supertest');
const path = require('path');
const app = require('../server');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

jest.mock('../models/User');

// Mock multer to bypass image upload
jest.mock('multer', () => {
    const m = () => ({
      single: () => (req, res, next) => {
        req.file = { path: 'public/uploads/mock.png' };
  
        // Simulate multer populating form fields into req.body
        req.body = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: '123456',
          confirmPassword: '123456'
        };
  
        next();
      },
      array: () => (req, res, next) => {
        req.files = [{ path: 'public/uploads/mock1.png' }];
        next();
      }
    });
  
    m.diskStorage = () => ({});
    return m;
  });
  

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      User.findOne.mockImplementation(() => ({
        exec: () => Promise.resolve(null)
      }));

      User.prototype.save = jest.fn().mockResolvedValue({ _id: 'mockid' });

      const res = await request(app)
        .post('/auth/register')
        .type('form') // 👈 Ensures req.body is parsed properly
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .field('email', 'john@example.com')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .attach('profileImage', path.resolve(__dirname, 'dummy.jpg'));

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('User registered successfully');
    });

    it('should fail if email already exists', async () => {
      User.findOne.mockImplementation(() => ({
        exec: () => Promise.resolve({ email: 'john@example.com' })
      }));

      const res = await request(app)
        .post('/auth/register')
        .type('form') // 👈 Same fix here
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .field('email', 'john@example.com')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .attach('profileImage', path.resolve(__dirname, 'dummy.jpg'));

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toBe('User already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should login an existing user', async () => {
      const hashed = await bcrypt.hash('123456', 10);

      User.findOne.mockImplementation(() => ({
        exec: () =>
          Promise.resolve({
            _id: 'mockid',
            email: 'john@example.com',
            password: hashed,
            toObject: () => ({
              _id: 'mockid',
              email: 'john@example.com',
              password: hashed
            })
          })
      }));

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'john@example.com', password: '123456' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.token).toBeDefined();
    });

    it('should return error for wrong password', async () => {
      const hashed = await bcrypt.hash('correctpass', 10);

      User.findOne.mockImplementation(() => ({
        exec: () =>
          Promise.resolve({
            password: hashed,
            toObject: () => ({ password: hashed })
          })
      }));

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'john@example.com', password: 'wrongpass' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid Credentials');
    });

    it('should return error if user does not exist', async () => {
      User.findOne.mockImplementation(() => ({
        exec: () => Promise.resolve(null)
      }));

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'nouser@example.com', password: '123456' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe(`User doesn't exist!`);
    });
  });
});
