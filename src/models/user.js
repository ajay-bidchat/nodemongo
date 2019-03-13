const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set(value) {
            if( typeof value !== 'string') {
                throw Error('Name must be of type string');
            }
            
            return value;
        }
    },

    age: {
        type: Number,
        validate(value) {
            if (value <= 0) {
                throw new Error('Age must be a +ve number');
            }
        }
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('Email is invalid!');
        },
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password'))
                throw new Error('Password cannot contain password');
        }
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    
    next();
});

userSchema.pre('remove', async function(next) {
    const user = this;

    await Task.deleteMany({
        user: user._id
    });

    next();
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    
    if (!user)
        throw new Error('Email/Password does not match');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
        throw new Error('Email/Password does not match');

    return user;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign({
        _id: user._id.toString()
    }, 'bestsecreteever');

    user.tokens = user.tokens.concat({
        token
    });

    await user.save();
    return token;
}

userSchema.methods.toJSON = function() {
    const user = this;

    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;

    return userObj;
}

//Reln bw 2 entities
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user'
});

const User = mongoose.model('User', userSchema);

module.exports = User;