const express = require( 'express');
const app=express()
const cors = require('cors');
const port=process.env.PORT||5000
require('dotenv').config()
//middleWare
app.use(cors())
app.use(express.json())

console.log(process.env.USER_NAME);
//connect mongodb

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS}@cluster0.pnsxsk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
   
    const database = client.db("touristPlace");
    const placesCollection = database.collection("places");
    await client.connect();
    
    app.get('/places',async(req,res)=>{
        const cursor=placesCollection.find()
        const result=await cursor.toArray()
        res.send(result)
    })
   

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('the server runing start')
})
app.listen(port)