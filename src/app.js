const express = require('express');

//DB Connection
require('./db/mongoose');

//Server
const app = express();

//Utils
const responseLogger = require('./utils/response_logger');

//Routes
const usersRoutes = require('./routes/users');
const tasksRoutes = require('./routes/tasks');

app.use(express.json());
// app.use(responseLogger);

app.use('/users', usersRoutes);
app.use('/tasks', tasksRoutes);

module.exports = app;

//jwt sign eg: jwt.sign({_id: '1234'}, 'secrete key', {expiresIn: '7 days});
//jwt 3 parts
//1 - header - meta info, type of token(jwt) and algorithm
//2 - payload, body - data + iat (issued at timestamp)
//3 - signature

//Postman test
// if (pm.response.code === 200 || pm.response.code === 201) {
//     pm.environment.set('authToken', pm.response.json().token);
// }

// /<img src="data:image/jpg;base64,binarydata"/>