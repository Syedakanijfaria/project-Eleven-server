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
        const tourPlanCollection = client.db('tourismOffers').collection('details_data');
        const userColection = client.db('tourismOffers').collection('user_data');

        // get all plan services
        app.get('/productTourPlans', async (req, res) => {
            const cursor = tourPlanCollection.find({});
            const tourPlans = await cursor.toArray();
            res.send(tourPlans);
        });
        //post new services by user
        app.post('/productTourPlans', async (req, res) => {
            const user = req.body;
            const tourPlans = await tourPlanCollection.insertOne(user);
            res.send(tourPlans);
        })
        // get single plan services
        app.get('/productTourPlans/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tourPlan = await tourPlanCollection.findOne(query);
            res.json(tourPlan);
        });
        // post userOrder by user
        app.post('/users', async (req, res) => {
            const user = req.body;
            //console.log('hit the post api', user);
            const result = await userColection.insertOne(user);
            //console.log(result);
            res.send(result);
        });
        // get all person userOrder
        app.get('/users', async (req, res) => {
            const cursor = userColection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });
        // get single person UserOrder
        app.get('/users/:email', async (req, res) => {
            const query = { Email: req.params.email };
            const user = await userColection.find(query).toArray();
            res.json(user);
        });
        // delete single data from user
        app.delete('/users/:email', async (req, res) => {
            const id = req.params.email;
            const query = { _id: ObjectId(id) };
            const result = await userColection.deleteOne(query);
            res.json(result);
        });
        //update pending statuts
        app.put('/users/:email', async (res, req) => {
            const id = req.params.email;
            const filter = { _id: ObjectId(id) };
            userColection
                .updateOne(filter, {
                    $set: {
                        status: "Approved",
                    },
                })
                .then((result) => {
                    res.send(result);
                });
        });
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);
















// /myOrder/:email
// const query = {email:req.params.email}
// orderCollection.find(query).toArray()
// res.json(............)
// fetch(`http://localhost;5000/myOrder/$(user.email)`

app.get('/', (req, res) => {
    res.send('Hello Hard Assignment ');
});

app.listen(port, () => {
    console.log('running genius server on port', port);
});