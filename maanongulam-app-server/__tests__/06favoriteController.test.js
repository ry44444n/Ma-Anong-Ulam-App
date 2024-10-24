import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/middlewares/app.js';
import Favorite from '../src/models/Favorite.js';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await Favorite.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Favorite API', () => {
  it('should add a recipe to favorites', async () => {
    const res = await request(app)
      .post('/api/favorites')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Recipe added to favorites');
  });

  it('should not add a recipe to favorites if already favorited', async () => {
    // First, add a favorite
    await request(app)
      .post('/api/favorites')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
      });

    // Try adding the same favorite again
    const res = await request(app)
      .post('/api/favorites')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Recipe already favorited');
  });

  it('should remove a recipe from favorites', async () => {
    // First, add a favorite
    await request(app)
      .post('/api/favorites')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
      });

    // Now, remove the favorite
    const res = await request(app)
      .delete('/api/favorites')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Recipe removed from favorites');
  });

  it('should return 404 when trying to remove a non-existent favorite', async () => {
    const res = await request(app)
      .delete('/api/favorites')
      .send({
        userId: 'user-id-123',
        recipeId: 'non-existent-recipe-id',
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Favorite not found');
  });

  it('should get all favorites for a user', async () => {
    // Add two favorites
    await request(app)
      .post('/api/favorites')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
      });

    await request(app)
      .post('/api/favorites')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-124',
      });

    // Get favorites for the user
    const res = await request(app)
      .get('/api/favorites/user-id-123');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('recipeId', 'recipe-id-123');
    expect(res.body[1]).toHaveProperty('recipeId', 'recipe-id-124');
  });
});
