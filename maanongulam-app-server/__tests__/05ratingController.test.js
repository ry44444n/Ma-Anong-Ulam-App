import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/middlewares/app.js';
import Rating from '../src/models/Rating.js';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await Rating.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Rating API', () => {
  
  it('should create a new rating', async () => {
    const res = await request(app)
      .post('/api/ratings')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
        rating: 4,
        isLiked: true,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId', 'user-id-123');
    expect(res.body).toHaveProperty('rating', 4);
    expect(res.body).toHaveProperty('isLiked', true);
  });

  it('should get all ratings for a specific recipe', async () => {
    await request(app)
      .post('/api/ratings')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
        rating: 4,
        isLiked: true,
      });

    await request(app)
      .post('/api/ratings')
      .send({
        userId: 'user-id-124',
        recipeId: 'recipe-id-123',
        rating: 3,
        isLiked: false,
      });

    const res = await request(app)
      .get('/api/ratings/recipeId/recipe-id-123');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
  });

  it('should update a rating by ratingId', async () => {
    const newRating = await request(app)
      .post('/api/ratings')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
        rating: 4,
        isLiked: true,
      });

    const ratingId = newRating.body.ratingId;

    const res = await request(app)
      .put(`/api/ratings/ratingId/${ratingId}`)
      .send({
        rating: 5,
        isLiked: false,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('rating', 5);
    expect(res.body).toHaveProperty('isLiked', false);
  });

  it('should soft delete a rating by ratingId', async () => {
    const newRating = await request(app)
      .post('/api/ratings')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
        rating: 4,
        isLiked: true,
      });

    const ratingId = newRating.body.ratingId;

    const res = await request(app)
      .delete(`/api/ratings/ratingId/${ratingId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Rating deleted successfully');

    const deletedRating = await Rating.findOne({ ratingId });
    expect(deletedRating.isDeleted).toBe(true);
  });

  it('should get the number of likes for a specific recipe', async () => {
    await request(app)
      .post('/api/ratings')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
        rating: 5,
        isLiked: true,
      });

    await request(app)
      .post('/api/ratings')
      .send({
        userId: 'user-id-124',
        recipeId: 'recipe-id-123',
        rating: 3,
        isLiked: false,
      });

    const res = await request(app)
      .get('/api/ratings/likes/recipe-id-123');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('likes', 1);  // Only one like
  });
});
