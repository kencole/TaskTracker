const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
var db

const PORT_NUMBER = 3000
const DB_NAME = 'tasks'
const DB_URL = 'mongodb://127.0.0.1:27017'

MongoClient.connect(DB_URL, (err, client) => {
    if (err) return console.log(err);
    db = client.db(DB_NAME);
    app.listen(PORT_NUMBER, () => {
        console.log('listening on ' + PORT_NUMBER);
    })
})

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    db.collection(DB_NAME).find().toArray((err, result) => {
        if (err) return console.log(err);

        res.render('index.ejs', {tasks: result})
    })
})

app.get('/delete/:id', (req, res) => {
    console.log(req)
    db.collection(DB_NAME).deleteOne({_id : new mongodb.ObjectID(req.params['id'])}, (err, result) => {
        if (err) return console.log(err);
        console.log('removed ' + req.params['id']);
        res.redirect('/');
    })
})
//
// app.post('/update', (req, res) => {
//     db.collection(DB_NAME).updateOne({'_id' : req.body._id}, req.body (err, result) => {
//
//     })
//     res.redirect('/');
// })

app.post('/create', (req, res) => {
    db.collection(DB_NAME).insertOne(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log('saved ' + result.insertedId);
        res.redirect('/');
    })
})
