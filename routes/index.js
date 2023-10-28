var express = require('express');
var router = express.Router();
var userModel = require('./users');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://krushnaproducts:Krushna11@cluster0.uvurvqw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/register', async function (req, res) {

  try {
    await client.connect();
    console.log('Connected to the database');

    const database = client.db('users'); // Replace with your database name
    const collection = database.collection('users'); // Replace with your collection name

    const { username, email, password,fname, lname } = req.body;

    // Check if the user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Insert the new user
    const result = await collection.insertOne({ username, email, password, fname , lname });
    console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    await client.close();
  }


    // const user = await userModel.create({
    //     username: req.body.username,
    //     firstName: req.body.fname,
    //     lastName: req.body.lname,
    //     email: req.body.email,
    //     password: req.body.password,
    //     isLogin: req.body.isLogin,
    // });
    // jwt.sign({ user: user }, 'secretkey', (err, token) => {
    //     res.json({
    //         token,
    //         user,
    //     });
    // });
});
router.get('/getAllUsers', async function (req, res) {
    const allUsers = await userModel.find();
    res.send(allUsers);
});

router.post('/login', async function (req, res) {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    const isPasswordValid = (await password) === user.password ? true : false;

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const accessToken = jwt.sign({ user: user }, 'secretkey', { expiresIn: '1h' });

    res.json({ token: accessToken, user: user });
});

router.put('/logout', async function (req, res) {
    const { username } = req.body;
    const user = await userModel.findOne({ username });
    if (user) {
        await userModel.findOneAndUpdate({ username }, { $set: { isLogin: false } }, { new: true });
        res.status(200).json({ message: 'User logged out successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
