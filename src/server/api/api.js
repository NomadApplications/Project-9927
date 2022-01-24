const express = require('express');
const fetch = require('node-fetch');

const passwordEncryptor = require('../../utils/password');

const User = require('../database/schemas/User');
const Team = require('../database/schemas/Team');
const database = require('../database/database');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('api')
})

router.get('/login', async (req, res) => {
    const user = await User.findOne({username: req.headers.username}).exec();
    if (user === null) return res.send(false);
    if (user.password === undefined) return res.send(false);
    const valid = await passwordEncryptor.isPassword(user.password, req.headers.password);
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

    const pass = await passwordEncryptor.hashPassword(req.headers.password);
    const newUser = new User({
        username: req.headers.username,
        display_name: req.headers.username + Math.floor(Math.random() * 100),
        password: pass,
        email: req.headers.email,
        email_list: req.headers.email_list === 'true',
        to_do: []
    });
    database.saveModel(newUser);
    req.session.userId = newUser._id;
    console.log(newUser);
    res.send({});
})

router.get('/newteam', async (req, res) => {
    if(!req.session.userId) return res.send(false);
    const user = await User.findOne({_id:req.session.userId}).exec();
    if(user === null) return res.send(false);

    const newTeam = new Team({
        name: req.headers.name || user.display_name + "'s team",
        members: [user._id],
    });
    database.saveModel(newTeam);

    console.log("NEW TEAM: " + newTeam._id)

    const teams = user.teams;
    teams.push(newTeam._id);

    await User.updateOne({_id: req.session.userId}, {teams: teams})

    res.send(true);
})

module.exports = router;