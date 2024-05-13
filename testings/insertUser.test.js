// Import the insertUser function from the login service
const { insertUser } = require("../services/login.service");

// Mock the database connection
jest.mock("../dbConnection", () => ({
  GYM: jest.fn(),
}));

describe('insertUser API', () => {
  // Increase timeout to 10 seconds for both tests
  test('should insert a new user with unique email', async () => {
    const userData = {
      firstName: 'John',
      secondName: 'Doe',
      address: '123 Street',
      contact: '1234567890',
      height: 175,
      weight: 70,
      email: 'testing12@gym.com',
      password: 'password123',
    };

    const result = await insertUser(userData);

    expect(result.success).toBe(true);
    expect(result.message).toBe('User inserted successfully');
    expect(result.statusCode).toBe(200);
  }, 40000); // 10000ms timeout (10 seconds)

  test('should not insert user with duplicate email', async () => {
    const userData = {
      firstName: 'Jane',
      secondName: 'Doe',
      address: '456 Avenue',
      contact: '0987654321',
      height: 160,
      weight: 60,
      email: 'testing@gym.com',
      password: 'password456',
    };

    const result = await insertUser(userData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Email already exists');
    expect(result.statusCode).toBe(409);
  }, 40000); // 10000ms timeout (10 seconds)
});
