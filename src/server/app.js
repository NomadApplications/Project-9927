const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const defaultPort = 3000;

const ObjectId = require('mongoose').Types.ObjectId;
const database = require('./database/database');
const User = require('./database/schemas/User')
const Team = require('./database/schemas/Team')

const passwordEncryptor = require('../utils/password');
/**
 * Starts the server on the specified port
 * @param {number} port Which port you want to set the server to
 * @returns {Promise<Server>} Promise representation of the server
 */
async function startServer(port = 3000) {
    const db = await database.startDatabase();

    const app = express();

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(bodyParser.json());

    app.use('/public', express.static(path.join(__dirname + '/public')));

    app.use(cookieSession({
        name: 'project-9927',
        keys: ['c84020e7-103e-4a49-a672-8e23bc4dc09c'],
        maxAge: 24 * 60 * 60 * 1000
    }));

    app.set('trust proxy', 1);
    app.set('views', path.join(__dirname + "/views"));
    app.set('view engine', 'pug');

    const portToUse = port || defaultPort;

    app.listen(portToUse, () => {
        console.log(`Now listening on port ${portToUse}`);
    });

    app.get('/', async (req, res) => {
        const user = await User.findOne({_id: req.session.userId}).exec();
        res.render('layout', {
            title: 'Project 9927',
            user
        });
    })

    app.get('/login', async (req, res) => {
        const user = await User.findOne({_id: req.session.userId}).exec();
        res.render('login', {
            user
        })
    });
    app.get('/signup', (req, res) => res.render('signup'));
    app.get('/profile', async (req, res) => {
        if(!req.session.userId) {
            res.redirect('/login');
            return;
        }
        const user = await User.findOne({_id: req.session.userId}).exec();
        if(user === null){
            res.redirect('/login');
            return;
        }
        const teams = [];
        for(let i = 0; i < user.teams.length; i++){
            const team = await Team.findOne({_id: user.teams[i]}).exec();
            if(team !== null)
                teams.push(team)
        }

        res.render('user/profile', {
            title: user.display_name + "'s profile | Project 9927",
            user,
            teams
        });
    })
    app.get('/profile/settings', async(req, res) => {
        if(!req.session.userId) {
            res.redirect('/login');
            return;
        }
        const user = await User.findOne({_id: req.session.userId}).exec();
        if(user === null){
            res.redirect('/login');
            return;
        }
        const teams = [];
        for(let i = 0; i < user.teams.length; i++){
            const team = await Team.findOne({_id: user.teams[i]}).exec();
            if(team !== null)
                teams.push(team)
        }

        const isPassword = async (password) => {
            console.log(password);
            console.log(user.password);
            return await passwordEncryptor.isPassword(user.password, password);
        }

        const changePassword = async (password) => {
            const hashed = await passwordEncryptor.hashPassword(password)
            User.updateOne({_id: user._id}, {password: hashed});
            req.session = null;
        }

        res.render('user/settings', {
            title: user.display_name + "'s profile | Project 9927",
            user,
            teams,
            isPassword,
            changePassword
        });
    });

    app.get('/user/:userId', async(req, res) => {
        if(!ObjectId.isValid(req.params.userId)){
            res.render('404');
            return;
        }
        const user = await User.findOne({_id: req.params.userId}).exec();
        if(user === null){
            res.render('404');
            return;
        }
        if(!user.visible){
            res.render('404');
            return;
        }
        res.render('user/publicUser', {
            user
        })
    })

    app.get("/404", (req, res) => res.render('404'));

    app.use('/api', require('./api/api'));

    return new Promise((resolve, reject) => {
        resolve(new Server(app, portToUse, db));
    });
}

class Server {
    /**
     * @param {express} app
     * @param {number} port
     * @param {mongoose.Connection} db
     * @constructor
     */
    constructor(app, port, db) {
        this.app = app;
        this.port = port;
        this.db = db;
    }
}

module.exports = {
    startServer,
    Server
}