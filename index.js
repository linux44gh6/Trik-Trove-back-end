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

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const countryCollection=database.collection('CountryCollection')
    await client.connect();
    
    app.get('/places',async(req,res)=>{
        const cursor=placesCollection.find()
        const result=await cursor.toArray()
        res.send(result)
    })
   app.get('/allCountry',async(req,res)=>{
    const cursor=countryCollection.find()
    const result=await cursor.toArray()
    res.send(result)
   })

   app.get('/allCountry/:name',async(req,res)=>{
    const name=req.params.name
    const query={country_Name:name}
    const result=await countryCollection.find(query).toArray()
    res.send(result)
   })
app.get('/country/:id',async(req,res)=>{
  const id=req.params.id
  const query={_id:new ObjectId(id)}
  const result=await countryCollection.findOne(query)
  res.send(result)
})

    app.get('/places/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await placesCollection.findOne(query)
      res.send(result)
    })
    //get user by email
    app.get('/place/:email',async(req,res)=>{
      const email=req.params.email
      const query={email:email}
     const result=await placesCollection.find(query).toArray()
     res.send(result)
    
    })
//update a document
app.put('/update/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id:new ObjectId(id)}
  const options = { upsert: true };
  const updateDoc=req.body
  const Doc={
    $set:{
      tourists_spot_name:updateDoc.tourists_spot_name,
      short_description:updateDoc.short_description,
      country_Name:updateDoc.country_Name,
      average_cost:updateDoc.average_cost,
      seasonality:updateDoc.seasonality,
      travel_time:updateDoc.travel_time,
      totalVisitorsPerYear:updateDoc.totalVisitorsPerYear,
      image:updateDoc.image,
      location:updateDoc.location
    },
  };
  const result=await placesCollection.updateOne(filter,Doc,options)
  console.log(result);
  res.send(result)
})
//delete a doc from dataBase
app.delete("/places/:id",async(req,res)=>{
  const id=req.params.id
  const query={_id:new ObjectId(id)}
  const result=await placesCollection.deleteOne(query)
  res.send(result)
})
    app.post('/places',async(req,res)=>{
      const place=req.body
      const result=await placesCollection.insertOne(place)
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