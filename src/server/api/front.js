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
    const projects = [];
    for(let i = 0; i < user.projects.length; i++) {
        const p = await Project.findOne({_id: user.projects[i]}).exec();
        if(p !== null && p.team_id === undefined)
            projects.push(p);
    }
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
    if(!ObjectId.isValid(req.params.teamId)) return res.redirect('/profile');
    if(req.session.userId === undefined) return res.redirect('/')
    const user = await User.findOne({_id: req.session.userId}).exec();
    if(user === null) return res.redirect('/');

    const team = await Team.findOne({_id: req.params.teamId}).exec();
    if(team === null) return res.redirect('/');

    const projects = [];
    for(let i = 0; i < team.projects.length; i++) {
        const p = await Project.findOne({_id: team.projects[i]}).exec();
        if (p !== null)
            projects.push(p);
    }

    res.render('user/team/team', {
        user,
        team,
        projects
    });
});
router.get('/project/:projectId', async(req, res) => {
    if(!ObjectId.isValid(req.params.projectId)) return res.redirect('/profile');
    if(req.session.userId === undefined) return res.redirect('/');
    const user = await User.findOne({_id: req.session.userId}).exec();
    if(user === null) return res.redirect('/');

    const teams = (await Team.find()).filter(i => i.members.includes(user._id));

    const project = await Project.findOne({_id: req.params.projectId}).exec();
    if(project === null) return res.redirect('/profile')

    const teamProject = project.team_id === undefined ? undefined : await Team.findOne({_id:project.team_id}).exec();
    const members = [];
    if(teamProject !== undefined){
        for(let i = 0; i < teamProject.members.length; i++){
            const m = await User.findOne({_id:teamProject.members[i]}).exec();
            members.push(m);
        }
    } else {
        members.push(user);
    }

    res.render('user/project',{
        user,
        teams,
        teamProject,
        members,
        project: project || {}
    });
});
router.get('/project/:projectId/todo', async(req, res) => {
    if(!ObjectId.isValid(req.params.projectId)) return res.redirect('/profile');
    if(req.session.userId === undefined) return res.redirect('/');
    const user = await User.findOne({_id: req.session.userId}).exec();
    if(user === null) return res.redirect('/');

    const teams = (await Team.find()).filter(i => i.members.includes(user._id));

    const project = await Project.findOne({_id: req.params.projectId}).exec();
    if(project === null) return res.redirect('/profile')

    const teamProject = project.team_id === undefined ? undefined : await Team.findOne({_id:project.team_id}).exec();
    const members = [];
    if(teamProject !== undefined){
        for(let i = 0; i < teamProject.members.length; i++){
            const m = await User.findOne({_id:teamProject.members[i]}).exec();
            members.push(m);
        }
    } else {
        members.push(user);
    }

    res.render('user/todo',{
        user,
        teams,
        teamProject,
        members,
        project: project || {}
    });
});
router.get('/newproject', async(req,res) => {
    const user = await User.findOne({_id: req.session.userId}).exec();
    const teams = user === null ? [] : (await Team.find()).filter(i => i.members.includes(user._id));
    res.render('projects/newProject', {user, teams});
})

// ===============================================
//                   PUBLIC
// ===============================================

router.get('/user/:username', async(req, res) => {
    const user = await User.findOne({username: req.params.username}).exec();
    if(user === null){
        res.render('404');
        return;
    }
    if(!user.visible){
        res.render('404');
        return;
    }
    const projects = [];
    for(let i = 0; i < user.projects.length; i++){
        const p = await Project.findOne({_id: user.projects[i]}).exec();
        if(p !== null && p.team_id === undefined && p.public)
            projects.push(p);
    }
    res.render('user/publicUser', {
        projects,
        user
    })
})
router.get('/404', (req, res) => res.render('404'));
router.get('/ideas', async(req,res) => {
    const user = req.session.userId === undefined ? null : await User.findOne({_id: req.session.userId}).exec();

    res.render('ideas/ideas', {user});
});

module.exports = router;