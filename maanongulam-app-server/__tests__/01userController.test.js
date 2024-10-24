import mongoose from 'mongoose'; 
import request from 'supertest'; 
import app from '../src/middlewares/app.js'; 
import User from '../src/models/User.js'; 
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        contactNumber: '123456789',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body).toHaveProperty('userId');
  });

  it('should not register a user with an existing email', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser1',
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser2',
        email: 'testuser@example.com',
        password: 'password456',
        firstName: 'Jane',
        lastName: 'Doe',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should log in a user', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token');
  });

  it('should not log in with incorrect credentials', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should get user by username', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

    const res = await request(app)
      .get('/api/users/testuser')
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).toHaveProperty('firstName', 'John');
    expect(res.body).toHaveProperty('lastName', 'Doe');
    expect(res.body).not.toHaveProperty('password'); // Ensure password is not returned
  });

  it('should update user details', async () => {
    const user = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

    const userId = user.body.userId;

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        contactNumber: '987654321',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User updated successfully');
    expect(res.body.user).toHaveProperty('firstName', 'Jane');
    expect(res.body.user).toHaveProperty('lastName', 'Doe');
    expect(res.body.user).toHaveProperty('contactNumber', '987654321');
  });

  it('should deactivate a user', async () => {
    const user = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

    const userId = user.body.userId;

    const res = await request(app)
      .put(`/api/users/deactivate/${userId}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User deactivated successfully');

    const deactivatedUser = await User.findOne({ userId });
    expect(deactivatedUser.isDeactivated).toBe(true);
  });

  it('should soft delete a user', async () => {
    const user = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

    const userId = user.body.userId;

    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');

    const deletedUser = await User.findOne({ userId });
    expect(deletedUser.isDeleted).toBe(true);
  });
});