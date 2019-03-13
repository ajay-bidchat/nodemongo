//CRUD
// const mongodb = require('mongodb');
// const mongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const {MongoClient, ObjectID} = require('mongodb');

const connectURL = 'mongodb://127.0.0.1:27017';
const dbname = 'task-force';

const id = new ObjectID();
console.log(id);
console.log(id.id); //binary id
console.log(id.toHexString(), id.toHexString().length)
console.log(id.getTimestamp());

MongoClient.connect(connectURL, {
    useNewUrlParser: true
}, (err, client) => {
    if (err) {
        return console.log('Unable to connect to database!');
    }

    console.log('Connected to mongodb server');

    const db = client.db(dbname);

    // db.collection('users').insertOne({
    //     name: 'Best Name'
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Error occured while saving the data');
    //     }

    //     console.log(res.ops);
    // });

    // db.collection('task').insertMany([{
    //     description: 'Do Something',
    //     completed: false
    // }, {
    //     description: 'Just do it!',
    //     completed: false
    // }], (err, res) => {
    //     if (err) {
    //         return console.log('Error occured while saving tasks');
    //     }

    //     console.log(res.ops);
    // })

    // db.collection('users').findOne({
    //     name: 'Best Name'
    // }, (err, users) => {
    //     if (err) {
    //         return console.log('Unable to fetch users');
    //     }
    //     console.log(users);
    // });

    //Returns a cursor instead of results
    // db.collection('users').find({
    //     name: 'Best Name'
    // }).toArray((err, users) => {
    //     if (err) {
    //         return console.log('Unable to fetch users'); 
    //     }
    //     console.log(users);
    // });

    // db.collection('users').updateOne({
    //     _id: new ObjectID("5c863643f8f2023a684092e1")
    // }, {
    //     //update operators
    //     $set: {
    //         name: "Lels"
    //     }
    // }).then(res => {
    //     console.log(res);
    // }).catch(err => {
    //     console.log('Error occurred while updating the document');
    // });

    // db.collection('task').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then(res => {
    //     console.log(res);
    // }).catch(err => {
    //     console.log('Error occurred while updating the document');
    // });

    db.collection('users').deleteMany({
        _id: new ObjectID('5c86339f4e515b3905c871ee')
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log('Error occurred while updating the document');
    });
});