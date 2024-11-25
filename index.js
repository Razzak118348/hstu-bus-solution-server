const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =  express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())


// mongodb connect


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.kqp32.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



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

const bussCollection = client.db('eceproject').collection('project');
const facultyRequest = client.db('eceproject').collection('facultyRequest')

// get api
app.get('/allbuss',async(req,res)=>{
const cursor = bussCollection.find();
const result =await cursor.toArray();
res.send(result)
})

//get individual by id
app.get('/allbuss/:id',async(req,res)=>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result =await bussCollection.findOne(query);
  res.send(result);
})



//creat data/ post  api
app.post('/allbuss',async(req,res)=>{
  const buss = req.body;
  const result = await bussCollection.insertOne(buss);
  res.json(result)
})

//update  api
app.patch('/allbuss/:id',async(req,res)=>{
  const id = req.params.id;
  console.log(id)
  const filter = {_id : new ObjectId(id)}
  // console.log(filter)
  const options = { upsert: true };
  const updateBuss = req.body;

  const buss ={
    $set:{
      category : updateBuss.category,
      leaving_time : updateBuss.leaving_time,

leaving_place:updateBuss.leaving_place,

    }
  }
const result = await  bussCollection.updateOne(filter,buss,options);
res.send(result)

})

//delete api
app.delete('/deletebuss/:id',async(req,res)=>{
  const id = req.params.id;
  const  query = { _id: new ObjectId(id) };
  const result = await bussCollection.deleteOne(query);
  res.json(result)

})



// faculty request
// get api
app.get('/allRequest',async(req,res)=>{
  const cursor = facultyRequest.find();
  const result =await cursor.toArray();
  res.send(result)
  })

  app.post('/allRequest',async(req,res)=>{
    const buss = req.body;
    const result = await facultyRequest.insertOne(buss);
    res.json(result)
  })
  app.delete('/allRequest/:id',async(req,res)=>{
    const id = req.params.id;
    const  query = { _id: new ObjectId(id) };
    const result = await facultyRequest.deleteOne(query);
    res.json(result)

  })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Ece project is running')
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})