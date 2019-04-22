const request = require('supertest');

const app = require('../src/app');

const User = require('../src/models/user');

const { _id, user1, setupDatabase, tearDown } = require('./fixtures/db');

jest.setTimeout(15000);

beforeEach(setupDatabase);

afterAll(tearDown);

test("Should signup a new user", async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: "Enax",
            age: "24",
            email: "test@email.com",
            password: "lels123"
        })
        .expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: 'Enax',
            email: "test@email.com"
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('lels123');
});

test("Should login existing user", async() => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: user1.email,
            password: user1.password
        })
        .expect(200);

    const user = await User.findById(_id);

    expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login non-existing user", async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: user1.email,
            password: user1.password + 'z'
        })
        .expect(401);
});

test("Should get the profile of user", async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200);
});

test("Should delete the user profile", async () => {
    await request(app)
        .delete('/users')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(_id);
    expect(user).toBeNull();
});

test("Should upload avatar image", async () => {
    await request(app)
        .post('/users/avatar')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/bt.png')
        .expect(200);

    const user = await User.findById(_id);
    expect(user.avatar).toEqual(expect.any(Buffer));
});