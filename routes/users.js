const mongoose = require('mongoose');
// mongoose.connect("mongodb+srv://krushnaproducts:Krushna@11@cluster0.uvurvqw.mongodb.net/?retryWrites=true&w=majority");



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://krushnaproducts:Krushna11@cluster0.uvurvqw.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const userSchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  password: String,
  email: String,
  isLogin: Boolean,
});

module.exports = mongoose.model("users", userSchema);
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db('users'); // Replace with your database name
    const collection = database.collection('users'); // Replace with your collection name

    // Data to be inserted
    // const data = { name: 'John Doe', age: 30, email: 'johndoe@example.com' };

    // Insert the data
    // const result = await collection.insertOne(data);
    // console.log(result);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);