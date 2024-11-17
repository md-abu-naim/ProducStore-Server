const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors({
    origin: ["http://localhost:5173", "https://productstore-e2920.web.app", "https://productstore-e2920.firebaseapp.com",]
}))
app.use(express.json())



const uri = "mongodb+srv://productStore:PnxTIvBX8dpYzbAX@cluster0.zyfftle.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const productsCollection = client.db('productStore').collection('products')

        // get all products
        app.get('/products', async (req, res) => {
            const search = req.query.search
            const filter = req.query.filter
            const brand = req.query.brand
            const sort = req.query.sort
            const minPrice = parseFloat(req.query.minPrice)
            const maxPrice = parseFloat(req.query.maxPrice)
            const page = parseInt(req.query.page) - 1
            const size = parseInt(req.query.size)

            let query = {}
            if (filter) query = { category: filter }

            if (brand) query = { brand: brand }

            if (search) {
                query.name = { $regex: `${search}`, $options: 'i' }
            }

            if (minPrice && maxPrice) {
                query.price = { $gte: minPrice, $lte: maxPrice }
            }

            let options = {}
            if (sort === 'asc') {
                options.sort = { price: -1 }
            }
            else if (sort === 'dsc') {
                options.sort = { price: 1 }
            }
            else if (sort === 'Popularity') {
                options.sort = { rating: -1 }
            }

            const result = await productsCollection.find(query).sort(options.sort).skip(page * size).limit(size).toArray()
            res.send(result)
        })


        // get product count
        app.get('/products-count', async (req, res) => {
            const filter = req.query.filter
            const brand = req.query.brand
            const minPrice = parseFloat(req.query.minPrice)
            const maxPrice = parseFloat(req.query.maxPrice)

            let query = {}

            if (filter) query = { category: filter }
            if (brand) query = { brand: brand }
            if (minPrice && maxPrice) {
                query.price = { $gte: minPrice, $lte: maxPrice }
            }
            const count = await productsCollection.countDocuments(query)
            res.send({ count })
        })

        app.post('/products', async (req, res) => {
            const painting = req.body
            const result = await productsCollection.insertOne(painting)
            res.send(result)
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('ProducStore..')
})

app.listen(port, () => {
    console.log(`ProducStore running on port ${port}`)
})