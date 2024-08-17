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





app.get('/', (req, res) => {
    res.send('ProducStore..')
})

app.listen(port, () => {
    console.log(`ProducStore running on port ${port}`)
})