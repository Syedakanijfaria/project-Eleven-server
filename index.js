const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json());
const bodyParser = require('express');
app.use(bodyParser.urlencoded({ extended: true }));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzkru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected for assignment');
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello Assignment!');
});

app.listen(port, () => {
    console.log('running genius server on port', port);
});