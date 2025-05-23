const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require("mongodb");
require("dotenv").config();

// middlewere 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m5oq2pz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // DB Collection create  
    const hobbyHubCollection = client.db("hobby-hub").collection("groups");
    // collection for featured groups 
    const featuredGroupsCollection = client.db("hobby-hub").collection("featuredGroups");


    app.get("/groups", async (req, res) => {
      const result = await hobbyHubCollection.find().toArray();
      res.send(result);
    })

    app.get("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const result = await hobbyHubCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    })

    app.get("/featuredGroups", async (req, res) => {
      const result = await featuredGroupsCollection.find().toArray();
      res.send(result);
    })

    app.get("/featuredGroups/:id", async (req, res) => {
      const id = req.params.id;
      if(!ObjectId.isValid(id)){
        return res.status(400).send({error:"Error found"})
      }
      const data = { _id: new ObjectId(id) };
      console.log(id);

      const result = await featuredGroupsCollection.findOne(data);
      res.send(result);
      console.log(result);
    })

    app.post("/groups", async (req, res) => {
      const newHobby = req.body;
      const result = await hobbyHubCollection.insertOne(newHobby);
      res.send(result);
    })

    app.put('/groups/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedGroup = req.body;
      const updatedDoc = {
        $set: updatedGroup
      };
      const result = await hobbyHubCollection.updateOne(filter, updatedDoc, options);
      res.send(result);

    })

    app.delete("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await hobbyHubCollection.deleteOne(query);
      res.send(result);
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

app.get("/", (req, res) => {
  res.send("Hobby Hub from server")
})
app.listen(port, () => {
  console.log(`Hobby hub app listening on port ${port}`);
})
