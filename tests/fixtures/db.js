const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../../src/models/user');

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

module.exports = {
    _id,
    user1,
    setupDatabase
};