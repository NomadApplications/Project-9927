const express = require('express');
const fetch = require('node-fetch');
const headers = {'Content-Type': 'application/json'};

const User = require('../database/schemas/User');
const database = require('../database/database');

const endpoints = require('./apiEndpoints');

const router = express.Router();

router.get('/', (req, res) => {
    const username = 'test';
    const password = 'admin';
    res.redirect(`/api/login?username=${username}&password=${password}`);
})

router.get('/login', async (req, res) => {
    const user = await User.findOne({username: req.headers.username}).exec();
    if (user === null) return res.send(false);
    const valid = user.password === req.headers.password;
    if (valid) {
        req.session.userId = user._id;
    }
    res.send(valid);
})

router.get('/logout', async (req, res) => {
    try {
        req.session = null;
    } catch (e) {
        console.log(e)
    } finally {
        res.redirect('/');
    }
})

router.get('/signup', async (req, res) => {
    const userCheck = await User.findOne({username: req.headers.username}).exec();
    if (userCheck !== null) {
        res.send({error: "There is already a user with this username!"});
        return;
    }
    if (req.headers.password === '') {
        res.send({error: `${req.headers.password} is not a valid password!`});
        return;
    }
    const newUser = new User({
        username: req.headers.username,
        display_name: req.headers.username + Math.floor(Math.random() * 100),
        password: req.headers.password
    });
    database.saveModel(newUser);
    req.session.userId = newUser._id;
    res.send({});
})

router.get('/valid_user', async (req, res) => res.send(await database.userExists(req.headers.username)));

router.post('/new_user', async (req, res) => {
    const data = null;
    if (!await database.userExists(data.username)) {
        const user = new User({
            username: data.username,
            display_name: data.username,
            password: data.password
        });
        database.saveModel(user);
    }
})

module.exports = router;