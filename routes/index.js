var express = require('express');
var router = express.Router();
var userModel = require('./users');
var movieModel = require('./movies/movies-model');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')('sk_live_YICGQS7R2Achv8OTKwIeJblR00RSxFxG9m');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/register', async function (req, res) {
    const { username } = req.body;
    const foundUser = await userModel.findOne({ username });
    if (foundUser) {
        return res.status(400).json({ message: 'This Username is Already Registered', username:username });
    }
    else{
        const user = await userModel.create({
            username: req.body.username,
            firstName: req.body.fname,
            lastName: req.body.lname,
            email: req.body.email,
            password: req.body.password,
            isLogin: req.body.isLogin,
        });
        jwt.sign({ user: user }, 'secretkey', (err, token) => {
            res.json({
                token,
                user,
            });
        });
    }
});

router.get('/getAllUsers', async function (req, res) {
    const allUsers = await userModel.find();
    res.send(allUsers);
});
// router.post('/create-movie', async function (req, res) {
//     const movies = await movieModel.create({
//         Title: 'The Lion King',
//         Runtime: '118 min',
//         Year: '2019',
//         Poster: 'https://m.media-amazon.com/images/M/MV5BMjIwMjE1Nzc4NV5BMl5BanBnXkFtZTgwNDg4OTA1NzM@._V1_SX300.jpg',
//     });
//     res.send(movies);
// });

// router.get('/getMovies', async function (req, res) {
//     const movies = await movieModel.find();
//     res.send(movies);
// });

router.post('/login', async function (req, res) {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    await userModel.findOneAndUpdate({ username }, { $set: { isLogin: true } }, { new: false });
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
router.put('/book-movie', async function (req, res) {
    const { username } = req.body.user;
    const user = await userModel.findOne({ username });
    if (user) {
        await userModel.findOneAndUpdate({ username }, { $push: { tickets: req.body.movie } }, { new: true });
        res.status(200).json({ message: `User Successfully Booked Tickets For ${req.body.movie.moviename}`, data: user });
    } else {
        res.status(404).json({ message: 'User failed to book movie tickets' });
    }
});

module.exports = router;
