const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
    if (err) return console.log(err);
    db = client.db('tasks');
    app.listen(3000, () => {
        console.log('listening on 3000');
    })
})
    

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    db.collection('tasks').find().toArray((err, result) => {
        if (err) return console.log(err);

        res.render('index.ejs', {tasks: result})
    })
})


app.post('/quotes', (req, res) => {
    db.collection('tasks').save(req.body, (err, result) => {
        if (err) return console.log(err);

        console.log('saved to database');
        res.redirect('/');
    })
})

