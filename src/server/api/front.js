const express = require('express');
const router = express.Router();

const User = require('../database/schemas/User');
const Team = require('../database/schemas/Team');
const Project = require('../database/schemas/Project');

const passwordEncryptor = require("../../utils/password");
const ObjectId = require('mongoose').Types.ObjectId;

// ===============================================
//             SIGNUP AND LOGIN
// ===============================================

router.get('/login', async (req, res) => {
    const user = await User.findOne({_id: req.session.userId}).exec();
    res.render('login', {user})
});
router.get('/signup', async(req, res) => {
    const user = await User.findOne({_id: req.session.userId}).exec();
    res.render('signup', {user})
});

// ===============================================
//                  PROFILES
// ===============================================

router.get('/profile', async (req, res) => {
    if(!req.session.userId) return res.redirect('/login');
    const user = await User.findOne({_id: req.session.userId}).exec();
    if(user === null) return res.redirect('/login');

    const teams = (await Team.find()).filter(i => i.members.includes(user._id));
    const projects = user.projects.filter((p) => p.team_id === undefined);

    res.render('user/profile', {
        title: user.display_name + "'s profile | Project 9927",
        user,
        teams,
        projects
    });
})
router.get('/profile/settings', async(req, res) => {
    if(!req.session.userId) return res.redirect('/login');
    const user = await User.findOne({_id: req.session.userId}).exec();
    if(user === null) return res.redirect('/login');

    const isPassword = async (password) => {
        return await passwordEncryptor.isPassword(user.password, password);
    }

    const changePassword = async (password) => {
        const hashed = await passwordEncryptor.hashPassword(password)
        User.updateOne({_id: user._id}, {password: hashed});
        req.session = null;
    }
    const teams = (await Team.find()).filter(i => i.members.includes(user._id));

    res.render('user/settings', {
        title: user.display_name + "'s profile | Project 9927",
        user,
        teams,
        isPassword,
        changePassword
    });
});

// ===============================================
//                   TEAMS
// ===============================================

router.get('/team/:teamId', async(req, res) => {
    if(req.session.userId === undefined) return res.redirect('/')
    const user = await User.findOne({_id: req.session.userId}).exec();
    if(user === null) return res.redirect('/');

    const team = await Team.findOne({_id: req.params.teamId}).exec();
    if(team === null) return res.redirect('/');

    res.render('user/team/team', {
       user,
       team,
    });
});
router.get('/project/:projectId', async(req, res) => {
    if(req.session.userId === undefined) return res.redirect('/');
    const user = await User.findOne({_id: req.session.userId}).exec();
    if(user === null) return res.redirect('/');

    const teams = (await Team.find()).filter(i => i.members.includes(user._id));

    let project = user.projects.find(x => x._id == req.params.projectId);

    console.log(user.projects);

    if(project === undefined) return res.redirect('/profile')

    res.render('user/project',{
        user,
        teams,
        project: project || {}
    });
});
router.get('/newproject', async(req,res) => {
    const user = await User.findOne({_id: req.session.userId}).exec();
    if(user === null) return res.redirect('/');
    const teams = (await Team.find()).filter(i => i.members.includes(user._id));
    res.render('projects/newProject', {user, teams});
})

// ===============================================
//                   PUBLIC
// ===============================================

router.get('/user/:username', async(req, res) => {
    if(!ObjectId.isValid(req.params.username)){
        res.render('404');
        return;
    }
    const user = await User.findOne({username: req.params.username}).exec();
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
router.get('/404', (req, res) => res.render('404'));
router.get('/ideas', async(req,res) => {
    if(req.session.userId === undefined) return res.redirect('/')
    const user = await User.findOne({_id: req.session.userId}).exec();
    if(user === null) return res.redirect('/');

    res.render('ideas/ideas', {user});
});

module.exports = router;