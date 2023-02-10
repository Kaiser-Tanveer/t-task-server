const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tl2ww1y.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



const run = async () => {
    try {
        // Collections 
        const categoriesCollection = client.db("tTask").collection("categories");
        const productsCollection = client.db("tTask").collection("allProducts");

        // Crud Operations 
        // Getting Category Data 
        app.get('/categories', async (req, res) => {
            const result = await categoriesCollection.find({}).toArray();
            console.log(result);
            res.send(result);
        })

        // Getting Products Data 
        app.get('/allProducts/:name', async (req, res) => {
            const name = req.params.name;
            const filter = { category_name: name };
            const result = await productsCollection.find(filter).sort({ price: 1 }).toArray();
            console.log(result);
            res.send(result);
        })
    }
    finally {

    }
}



run().catch(err => console.error(err));

app.get('/', async (req, res) => {
    res.send('T-Task server is running...');
});

app.listen(port, async (req, res) => {
    console.log(`T-Task is running on ${port}`);
});