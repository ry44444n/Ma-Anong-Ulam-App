import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/middlewares/app.js';
import Recipe from '../src/models/Recipe.js';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await Recipe.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Recipe API', () => {
  it('should create a new recipe', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .send({
        title: 'Test Recipe',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        instructions: 'Test instructions',
        userId: 'user-id-123',
        categoryId: 'category-id-123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Test Recipe');
    expect(res.body).toHaveProperty('recipeId');
  });

  it('should get all recipes', async () => {
    await request(app)
      .post('/api/recipes')
      .send({
        title: 'Test Recipe 1',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        instructions: 'Test instructions',
        userId: 'user-id-123',
        categoryId: 'category-id-123',
      });

    await request(app)
      .post('/api/recipes')
      .send({
        title: 'Test Recipe 2',
        ingredients: ['Ingredient 3', 'Ingredient 4'],
        instructions: 'Test instructions',
        userId: 'user-id-124',
        categoryId: 'category-id-124',
      });

    const res = await request(app)
      .get('/api/recipes');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
  });

  it('should get a recipe by ID', async () => {
    const newRecipe = await request(app)
      .post('/api/recipes')
      .send({
        title: 'Test Recipe',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        instructions: 'Test instructions',
        userId: 'user-id-123',
        categoryId: 'category-id-123',
      });

    const recipeId = newRecipe.body.recipeId;

    const res = await request(app)
      .get(`/api/recipes/${recipeId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Test Recipe');
  });

  it('should update a recipe', async () => {
    const newRecipe = await request(app)
      .post('/api/recipes')
      .send({
        title: 'Test Recipe',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        instructions: 'Test instructions',
        userId: 'user-id-123',
        categoryId: 'category-id-123',
      });

    const recipeId = newRecipe.body.recipeId;

    const res = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .send({
        title: 'Updated Recipe',
        ingredients: ['Updated Ingredient 1'],
        instructions: 'Updated instructions',
        categoryId: 'updated-category-id',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Updated Recipe');
    expect(res.body).toHaveProperty('ingredients', ['Updated Ingredient 1']);
  });

  it('should delete a recipe', async () => {
    const newRecipe = await request(app)
      .post('/api/recipes')
      .send({
        title: 'Test Recipe',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        instructions: 'Test instructions',
        userId: 'user-id-123',
        categoryId: 'category-id-123',
      });

    const recipeId = newRecipe.body.recipeId;

    const res = await request(app)
      .delete(`/api/recipes/${recipeId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Recipe deleted successfully');

    const deletedRecipe = await Recipe.findOne({ recipeId });
    expect(deletedRecipe.isDeleted).toBe(true);
  });

  it('should search for recipes', async () => {
    await request(app)
      .post('/api/recipes')
      .send({
        title: 'Test Recipe',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        instructions: 'Test instructions',
        userId: 'user-id-123',
        categoryId: 'category-id-123',
      });

    const res = await request(app)
      .get('/api/recipes/search?query=Test');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('title', 'Test Recipe');
  });

});
