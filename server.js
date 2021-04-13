const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const os = require("os");
const moment = require('moment-timezone');
require('dotenv').config();

var connectionString
if (process.env.DATABASE_URL)
    connectionString = process.env.DATABASE_URL
else
    connectionString = "mongodb://cosmos-mongodb-pa:OEkeT69LTD9SpRMTJkOOaBYDSMoIsr9Tq6z6ryMCF6RJS9mVeXnCdRw9eXIbVj1fnbJAcuQhAj6UU97IR2evkQ==@cosmos-mongodb-pa.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@cosmos-mongodb-pa@"
var public_ip;

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
    extended: true
}))
const port = process.env.WEB_PORT || 3000;

app.listen(port, function () {
    console.log(`listening on ${port}`)
})


MongoClient.connect(connectionString, {
        useUnifiedTopology: true
    })
    .then(client => {
        console.log('connected to the database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

        app.post('/quotes', (req, res) => {
            req.body.host = os.hostname();
            req.body.time = moment().tz("CET").format('HH:mm:ss')
            console.log(req.body)
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
            let i = 1n;
            let x = 3n * (10n ** 30020n);
            let pi = x;
            while (x > 0) {
                    x = x * i / ((i + 1n) * 4n);
                    pi += x / (i + 2n);
                    i += 2n;
            }
            // console.log(pi / (10n ** 20n));
        })

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', {
                        quotes: results
                    })
                })
                .catch(error => console.error(error))
        })
        app.get('/clear', (req, res) => {
            db.collection('quotes').deleteMany({}) //verwijder alles
                .then(results => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
    })
    .catch(error => console.error(error))
