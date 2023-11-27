const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://PercelDelivery:WwYg0zXwU01K2XX1@rahim.iilssri.mongodb.net/?retryWrites=true&w=majority";

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

    const userCollection = client.db("PercelDelivery").collection("users")
    const bookingCollection = client.db("PercelDelivery").collection("booking")

    // All  User
    app.get('/users', async(req, res) => {
        const user = await userCollection.find().toArray()
        res.send(user)
    })

    app.get('/user', async(req, res) => {
        let query = {}
        if(req.query?.email){
            query = {email: req.query.email}
        }
        const result = await userCollection.find(query).toArray()
        res.send(result)
    })

    app.post('/users', async(req, res) => {
        const user = req.body
        const result = await userCollection.insertOne(user)
        res.send(result)
    })

    app.patch('/users/admin/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)}
        const updateUser = {
            $set: {
                role: 'admin'
            }
        }
        const result = await userCollection.updateOne(filter, updateUser)
        res.send(result)
    })
    app.patch('/users/delivery/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)}
        const updateUser = {
            $set: {
                role: 'delivery'
            }
        }
        const result = await userCollection.updateOne(filter, updateUser)
        res.send(result)
    })

    // Bood percel
        app.get('/booking', async(req, res) => {
        let query = {}
        if(req.query?.email){
            query = {email: req.query.email}
        }
        const result = await bookingCollection.find(query).toArray()
        res.send(result)
    })

    app.post('/booking', async(req, res) => {
        const data = req.body
        const result = await bookingCollection.insertOne(data)
        res.send(result)
    })

    app.get('/booking/:id', async(req, res) => {
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await bookingCollection.findOne(query)
        res.send(result)
    })

    app.put('/booking/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updatedBooking = req.body;
        const options = {upsert: true}

        const food = {
            $set: {
                name: updatedBooking.name,
                email: updatedBooking.email,
                phone: updatedBooking.phone,
                percelType: updatedBooking.percelType,
                parcelWeight: updatedBooking.parcelWeight,
                receverName: updatedBooking.receverName,
                receverPhone: updatedBooking.receverPhone,
                deliveryDate: updatedBooking.deliveryDate,
                deliveryAddress: updatedBooking.deliveryAddress,
                deliveryAddressLatitude: updatedBooking.deliveryAddressLatitude,
                deliveryAddressLongitude: updatedBooking.deliveryAddressLongitude,
                price: updatedBooking.price,
            }
        }
        const result = await bookingCollection.updateOne(filter, food, options)
        res.send(result)
    })

    app.delete('/booking/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await bookingCollection.deleteOne(query)
        res.send(result)
    })

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Percel server running now..')
})
app.listen(port, () => {
    console.log(`percel server runnig on port: ${port}`)
})
