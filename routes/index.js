var express = require('express');
var router = express.Router();
var userModel = require('./users');
const jwt = require('jsonwebtoken');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/register', async function (req, res) {
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
