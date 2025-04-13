const mongoose = require('mongoose');
const connectDB = require('../routes/connection');

jest.mock('mongoose');

describe('Database Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to MongoDB successfully (happy path)', async () => {
    mongoose.connect.mockResolvedValueOnce();

    // Mock console.log to verify it gets called
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.DB_URL);
    expect(logSpy).toHaveBeenCalledWith('Connected to MongoDB');

    logSpy.mockRestore();
  });

  it('should handle connection errors (sad path)', async () => {
    const error = new Error('Connection failed');
    mongoose.connect.mockRejectedValueOnce(error);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.DB_URL);
    expect(errorSpy).toHaveBeenCalledWith('Error connecting to database: ', error);
    expect(exitSpy).toHaveBeenCalledWith(1);

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
