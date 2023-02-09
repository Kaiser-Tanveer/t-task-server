const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tl2ww1y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        // Collections 
        const categoryCollection = client.db("tTask").collection("categories");


    }
    finally {

    }
}


app.get('/', async (req, res) => {
    res.send('T-Task server is running...');
});

app.listen(port, async (req, res) => {
    console.log(`T-Task is running on ${port}`);
});