const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const os = require("os");
const moment = require('moment-timezone');

const connectionString = 'mongodb://pamongodb:vmuG76P319kDzBjrko4FKmEanbijFzDcX2m2OAzIWGarTAp3hdmiRworu06A9gYhii3gxRbltCSZ22p4d6bCqw==@pamongodb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@pa-mongo-demo@' //'mongodb://root:example@127.0.0.1:27017/admin'
var public_ip;

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
    extended: true
}))

app.listen(3000, function () {
    console.log('listening on 3000')
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
    })
    .catch(error => console.error(error))