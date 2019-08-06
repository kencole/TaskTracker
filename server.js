const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
var db
var taskCounter = 0

const PORT_NUMBER = 8080
const DB_NAME = 'tasks'
const DB_URL = 'mongodb://127.0.0.1:27017'

MongoClient.connect(DB_URL, {useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err);
    db = client.db(DB_NAME);
    app.listen(PORT_NUMBER, () => {
        console.log('listening on ' + PORT_NUMBER);
    })
})

app.use(bodyParser.urlencoded({extended: true}));

app.get('/css/style.css', (req, res) => {
    res.sendFile('/css/style.css', { root : __dirname});
})

app.get('/', (req, res) => {
    db.collection(DB_NAME).find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('index.ejs', {tasks: result})
    })
})

app.get('/delete/:id', (req, res) => {
    db.collection(DB_NAME).deleteOne(
        {_id : new mongodb.ObjectID(req.params['id'])},
        (err, result) =>
        {
            if (err) return console.log(err);
            console.log('removed ' + req.params['id']);
            res.redirect('/');
        }
    )
})

app.post('/create', (req, res) => {
    console.log(req.body);
    var newTask = {
        name : req.body.name,
        description : req.body.description,
        completed : req.body.completed,
        category : req.body.category,
        number : taskCounter++
    }
    db.collection(DB_NAME).insertOne(newTask, (err, result) => {
        if (err) return console.log(err);
        console.log('created ' + result.insertedId);
        res.redirect('/');
    })
})
