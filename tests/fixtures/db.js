const jwt = require('jsonwebtoken');

const User = require('../../src/models/user');

const mongoose = require('../../src/db/mongoose');

const _id = new mongoose.Types.ObjectId();

const user1 = {
    _id,
    name: 'Christofer Null',
    age: 17,
    email: 'null@nullable.com',
    password: 'lolwa1234',
    tokens: [{
        token: jwt.sign({ _id }, process.env.JWT_SECRET)
    }]
};

const setupDatabase = async () => {
    await User.deleteMany();
    await new User(user1).save();
};

const tearDown = async() => {
    await mongoose.disconnect();
}

module.exports = {
    _id,
    user1,
    setupDatabase,
    tearDown
};