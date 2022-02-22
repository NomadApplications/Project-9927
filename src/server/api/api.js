const express = require('express');
const router = express.Router();

const mailer = require('../../mailer/mailer');
const passwordEncryptor = require('../../utils/password');

const User = require('../database/schemas/User');
const Team = require('../database/schemas/Team');
const Project = require('../database/schemas/Project');
const database = require('../database/database');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/', (req, res) => {
    res.render('api')
})

// ===============================================
//                  ACCOUNTS
// ===============================================

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
        res.send({error: `You must enter a password!`});
        return;
    }
    if(req.headers.password.length < 6) {
        res.send({error: `Your password must be at least 6 characters`});
        return;
    }

    let d = new Date().getTime();
    const vCode = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    const pass = await passwordEncryptor.hashPassword(req.headers.password);
    const newUser = new User({
        username: req.headers.username,
        display_name: req.headers.username + Math.floor(Math.random() * 100),
        password: pass,
        email: req.headers.email,
        email_list: req.headers.email_list === 'true',
        to_do: [],
        verification_code: vCode
    });
    database.saveModel(newUser);
    req.session.userId = newUser._id;

    mailer.sendMail({
        to: newUser.email,
        subject: 'User Registration: ' + newUser.username,
        text: `\n
        If your account name is not ${newUser.username} please delete this email.\n
        Please visit the link below to verify your account!\n
        https://project-9927.herokuapp.com/api/verify/${vCode}`,
    });

    res.send({});
})

router.get('/user/delete_acc', async (req, res) => {
    if(!req.session.userId) {
        res.send({error: "You aren't currently signed in. Please sign in and try again."});
        return;
    }
    const user = await User.findOne({_id: req.session.userId}).exec();
    if(user === null){
        res.send({error: "There was an error."});
        return;
    }
    if(req.headers.verification_code !== user.verification_code){
        res.send({error: "There was an error."});
        return;
    }
    await User.deleteOne({verification_code: req.headers.verification_code});
    res.send(true);
});
router.get('/verify/:verification_code', async (req, res) => {
    const vTest = await User.findOne({verification_code: req.params.verification_code}).exec();
    if(vTest === null) return res.redirect('/404');
    if (vTest.password === undefined) return res.redirect('/404');

    await User.updateOne({username: vTest.username}, {
        $set: {
            verified: true
        }
    })
    res.redirect('/')
})

// ===============================================
//                  PASSWORDS
// ===============================================

router.get('/user/checkpassword', async (req, res) => {
    if(!req.session.userId) return res.send(false);
    const user = await User.findOne({_id: req.session.userId}).exec();
    if(user === null) return res.send(false);
    return res.send(await passwordEncryptor.isPassword(user.password, req.headers.password));
})
router.get('/user/changepassword', async(req, res) => {
    if(!req.session.userId) return res.send(false);
    const user = await User.findOne({_id: req.session.userId}).exec();
    if(user === null) return res.send(false);
    const hashed = await passwordEncryptor.hashPassword(req.headers.password)

    await User.updateOne({_id: user._id}, {password: hashed});
})


// ===============================================
//             PROJECTS AND TEAMS
// ===============================================

router.get('/newteam', async (req, res) => {
    if(!req.session.userId) return res.send(false);
    const user = await User.findOne({_id:req.session.userId}).exec();
    if(user === null) return res.send(false);

    const code = await database.getTeamCode();
    const newTeam = new Team({
        owner: user._id,
        name: req.headers.name || user.display_name + "'s team",
        members: [user._id],
        team_code: code
    });
    database.saveModel(newTeam);

    res.send(true);
});
router.get('/jointeam', async(req, res) => {
    if(!req.session.userId) return res.send(false);
    const user = await User.findOne({_id:req.session.userId}).exec();
    if(user === null) return res.send(false);

    const team = await Team.findOne({team_code: req.headers.team_code}).exec();
    if(team === null) return res.send(false);

    if(team.members.includes(user._id)) return res.send(false);

    const newMembers = team.members;
    newMembers.push(user._id);
    await Team.updateOne({team_code: req.headers.team_code}, {members: newMembers});
    res.send(true);
})
router.get('/newproject', async(req, res) => {
    if(!req.session.userId) return res.send({error:'You are not logged in!'});
    const user = await User.findOne({_id:req.session.userId}).exec();
    if(user === null) return res.send({error:'You are not logged in!'});

    if(user.projects.length >= 3) return res.send({error:'You already have 3 projects!'});

    const doc = {
        name: req.headers.name || 'Project' + Math.floor(Math.random() * 100),
        owner: user._id,
    };
    if(req.headers.team !== '' && ObjectId.isValid(req.headers.team))
        doc['team_id'] = req.headers.team;

    const newProject = new Project(doc);
    database.saveModel(newProject);

    const projects = user.projects;
    projects.push(newProject._id);
    await User.updateOne({_id:req.session.userId}, {projects: projects});

    if(req.headers.team !== '' && ObjectId.isValid(req.headers.team)){
        const team = await Team.findOne({_id:req.headers.team}).exec();
        if(team !== null){
            const teamProjects = team.projects;
            teamProjects.push(newProject._id);
            await Team.updateOne({_id:req.headers.team}, {projects: teamProjects});
        }
    }
    res.send({id: newProject._id});
});
router.get('/todo_data', async (req, res) => {
    if(!req.headers.projectid) return res.send({error:"No ProjectID"});
    if(!req.session.userId) return res.send({error:'You are not logged in!'});
    const user = await User.findOne({_id:req.session.userId}).exec();
    if(user === null) return res.send({error:'You are not logged in!'});

    const project = await Project.findOne({_id: req.headers.projectid}).exec()
    if(project === null) return res.send({error:"Project not found!"});
    if(project.to_do === undefined) return res.send({error:"There is no todo list!"});

    const json = JSON.parse(project.to_do);
    return res.send(json);
});
router.get('/set_todo', async(req,res) => {
    if(!req.headers.projectid) return res.send({error:"No ProjectID"});
    if(!req.session.userId) return res.send({error:'You are not logged in!'});
    const user = await User.findOne({_id:req.session.userId}).exec();
    if(user === null) return res.send({error:'You are not logged in!'});

    const project = await Project.findOne({_id: req.headers.projectid}).exec()
    if(project === null) return res.send({error:"Project not found!"});
    if(project.to_do === undefined) return res.send({error:"There is no todo list!"});

    const json = req.headers.data;
    await Project.updateOne({_id: project._id}, {to_do: json})
    res.send(true);
});
router.get('/delete_todo', async(req, res) => {
    if(!req.headers.projectid) return res.send({error:"No ProjectID"});
    if(!req.session.userId) return res.send({error:'You are not logged in!'});
    const user = await User.findOne({_id:req.session.userId}).exec();
    if(user === null) return res.send({error:'You are not logged in!'});

    const project = await Project.findOne({_id: req.headers.projectid}).exec()
    if(project === null) return res.send({error:"Project not found!"});
    if(project.to_do === undefined) return res.send({error:"There is no todo list!"});

    const json = JSON.stringify({
        table: [
            {
                id: 1,
                items: []
            },
            {
                id: 2,
                items: []
            },
            {
                id: 3,
                items: []
            },
        ]
    })

    await Project.updateOne({_id: project._id}, {to_do: JSON.stringify(json)})
});

const googleTrends = require('google-trends-api');

router.get('/idea', async(req, res) => {
    // CREATE IDEA HERE --- PLEASE FIX THIS I DONT FEEL LIKE WORRYING ABOUT IT RN
    const topics = req.headers.topics.split(',');
    if(topics.length === 0) return res.send({error:"No topics specified!"});

    googleTrends.relatedTopics({keyword: topics[0]})
        .then((r) => {
            const json = JSON.parse(r);
            const rankedList = json.default.rankedList;
            const result = rankedList[0].rankedKeyword;
            const ret = {
                amount: result.length,
                random: result[Math.floor(Math.random() * result.length-1)],
                results: result,
            };
            return res.send(ret);
        })
        .catch((err) => {
            console.log(err);
        })
});

module.exports = router;