import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/middlewares/app.js';
import Comment from '../src/models/Comment.js';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await Comment.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Comments API', () => {
  it('should create a new comment', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
        comment: 'This is a test comment.',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('comment', 'This is a test comment.');
    expect(res.body).toHaveProperty('commentId');
  });

  it('should get all comments for a recipe', async () => {
    await request(app)
      .post('/api/comments')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
        comment: 'First test comment.',
      });

    await request(app)
      .post('/api/comments')
      .send({
        userId: 'user-id-124',
        recipeId: 'recipe-id-123',
        comment: 'Second test comment.',
      });

    const res = await request(app)
      .get('/api/comments/recipeId/recipe-id-123');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('comment', 'First test comment.');
    expect(res.body[1]).toHaveProperty('comment', 'Second test comment.');
  });

  it('should update a comment by ID', async () => {
    const newComment = await request(app)
      .post('/api/comments')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
        comment: 'Original comment.',
      });

    const commentId = newComment.body.commentId;

    const res = await request(app)
      .put(`/api/comments/commentId/${commentId}`)
      .send({
        comment: 'Updated comment.',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('comment', 'Updated comment.');
  });

  it('should delete a comment by ID', async () => {
    const newComment = await request(app)
      .post('/api/comments')
      .send({
        userId: 'user-id-123',
        recipeId: 'recipe-id-123',
        comment: 'Comment to be deleted.',
      });

    const commentId = newComment.body.commentId;

    const res = await request(app)
      .delete(`/api/comments/commentId/${commentId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Comment deleted successfully');

    const deletedComment = await Comment.findOne({ commentId });
    expect(deletedComment.isDeleted).toBe(true);
  });
});
