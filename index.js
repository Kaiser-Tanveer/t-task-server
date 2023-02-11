const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tl2ww1y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// jwt verification middleware function 
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized Access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.WEB_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized Access' });
        }
        req.decoded = decoded;
        next();
    })
}


// jwt api 
app.post('/jwt', (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.WEB_TOKEN_SECRET, { expiresIn: "7d" });
    res.send({ token });
})


const run = async () => {
    try {
        // Collections 
        const categoriesCollection = client.db("tTask").collection("categories");
        const productsCollection = client.db("tTask").collection("allProducts");
        const bookingsCollection = client.db("tTask").collection("bookings");

        // Crud Operations 
        // Getting Category Data 
        app.get('/categories', async (req, res) => {
            const result = await categoriesCollection.find({}).toArray();
            res.send(result);
        })

        app.get('/products', async (req, res) => {
            const result = await productsCollection.find({}).sort({ price: -1 }).toArray();
            res.send(result);
        })

        // Getting Products Data by Category and ascending by price 
        app.get('/allProducts/:name', async (req, res) => {
            const name = req.params.name;
            const filter = { category_name: name };
            const result = await productsCollection.find(filter).sort({ price: 1 }).toArray();
            res.send(result);
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const details = await productsCollection.findOne(filter);
            res.send(details);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })

        app.get('/myBookings', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await bookingsCollection.find(query).toArray();
            res.send(result);
        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookingsCollection.deleteOne(filter);
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