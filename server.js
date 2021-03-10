const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const publicIp = require('public-ip');
const moment = require('moment-timezone');

const connectionString = 'mongodb://pa-mongo-demo:uiap7JnYMFmbS7ru9genJiNK5NlDRD0Awl7n64ANwFMH5GZkQB1xyBntGashziFS57bOpll7aJPtY9DcDHHOlA==@pa-mongo-demo.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@pa-mongo-demo@' //'mongodb://root:example@127.0.0.1:27017/admin'
var public_ip;

(async () => {
    global.public_ip = await publicIp.v4()
    console.log(global.public_ip)
})();

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
            req.body.ip = global.public_ip
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