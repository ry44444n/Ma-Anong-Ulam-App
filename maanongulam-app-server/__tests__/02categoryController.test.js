import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/middlewares/app.js';
import Category from '../src/models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await Category.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Category API', () => {
  it('should create a new category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send({
        categoryId: 'category-id-123',
        categoryName: 'Test Category',
        categoryImageUrl: 'http://example.com/image.jpg',
        categoryDescription: 'This is a test category.',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('categoryName', 'Test Category');
    expect(res.body).toHaveProperty('categoryId', 'category-id-123');
  });

});

it('should get all categories', async () => {
  await request(app)
    .post('/api/categories')
    .send({
      categoryId: 'category-id-123',
      categoryName: 'Test Category 1',
      categoryImageUrl: 'http://example.com/image1.jpg',
      categoryDescription: 'This is test category 1.',
    });

  await request(app)
    .post('/api/categories')
    .send({
      categoryId: 'category-id-124',
      categoryName: 'Test Category 2',
      categoryImageUrl: 'http://example.com/image2.jpg',
      categoryDescription: 'This is test category 2.',
    });

  const res = await request(app)
    .get('/api/categories');

  expect(res.statusCode).toEqual(200);
  expect(res.body.length).toBe(2);
});

it('should get a category by ID', async () => {
  const newCategory = await request(app)
    .post('/api/categories')
    .send({
      categoryId: 'category-id-123',
      categoryName: 'Test Category',
      categoryImageUrl: 'http://example.com/image.jpg',
      categoryDescription: 'This is a test category.',
    });

  const categoryId = newCategory.body.categoryId;

  const res = await request(app)
    .get(`/api/categories/${categoryId}`);

  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty('categoryName', 'Test Category');
});

it('should update a category', async () => {
  const categoryId = 'test-category-id'; // Use the categoryId defined in your test setup

  // Create a category first
  await request(app)
    .post('/api/categories')
    .send({
      categoryId,
      categoryName: 'Original Category',
      categoryDescription: 'Original description',
    });

  // Now attempt to update the category
  const res = await request(app)
    .put(`/api/categories/${categoryId}`)
    .send({
      categoryName: 'Updated Category', // Use the correct field names
      categoryDescription: 'Updated description',
    });

  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty('categoryName', 'Updated Category');
});

it('should get a category by category name', async () => {
  await request(app)
    .post('/api/categories')
    .send({
      categoryId: 'category-id-123',
      categoryName: 'Test Category',
      categoryImageUrl: 'http://example.com/image.jpg',
      categoryDescription: 'This is a test category.',
    });

  const res = await request(app)
    .get('/api/categories/categoryName/Test Category');

  expect(res.statusCode).toEqual(200);
  expect(res.body.length).toBeGreaterThan(0);
  expect(res.body[0]).toHaveProperty('categoryName', 'Test Category');
});

it('should delete a category', async () => {
  const newCategory = await request(app)
    .post('/api/categories')
    .send({
      categoryId: 'category-id-123',
      categoryName: 'Test Category',
      categoryImageUrl: 'http://example.com/image.jpg',
      categoryDescription: 'This is a test category.',
    });

  const categoryId = newCategory.body.categoryId;

  const res = await request(app)
    .delete(`/api/categories/${categoryId}`);

  expect(res.statusCode).toEqual(204);

  const deletedCategory = await Category.findOne({ categoryId });
  expect(deletedCategory).toBeNull();
});
