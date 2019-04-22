const request = require('supertest');

const app = require('../src/app');

const Task = require('../src/models/task');

const { _id, user1, setupDatabase, tearDown } = require('./fixtures/db');

beforeEach(setupDatabase);

afterAll(tearDown);

jest.setTimeout(13000);

test("Should create task for user", async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            description: "Best random task ever"
        })
        .expect(201);
    
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
}); 