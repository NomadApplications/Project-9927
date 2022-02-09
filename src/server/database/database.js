const mongoose = require('mongoose');
const User = require('./schemas/User');
const Team = require('./schemas/Team');

const username = 'project9927';
const password = 'ohiuhTZyh4vnpBUS'
const cluster = 'project9227';
const dbname = 'project9927';

/**
 * Starts the database and returns the db object
 * @returns {Promise<mongoose.Connection>} Database connection object
 */
function startDatabase() {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    const uri = `mongodb+srv://${username}:${password}@project9927.lou4o.mongodb.net/${dbname}`;
    mongoose.connect(uri).then((t) => {
        //console.log(t);
    }).catch(err => console.error(err));

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    return new Promise((resolve, reject) => {
        resolve(db);
    })
}

/**
 * Save a model via a function
 * @param {mongoose.Model} model
 */
function saveModel(model) {
    model.save(function (err) {
        if (err) {
            console.error(err);
            return;
        }
    })
}

/**
 * Get a team code
 * @returns {string} Team code
 */
async function getTeamCode() {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const generateResult = () => {
        result = '';
        for (let i = 0; i < 6; i++)
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    generateResult();
    const teams = await Team.find();
    while (teams.find(t => t.team_code == result) !== undefined) {
        generateResult();
    }
    return result;
}

module.exports = {
    startDatabase,
    saveModel,
    getTeamCode
}
