const mongoose = require('mongoose');
const User = require('./schemas/User');

const username = 'project9927';
const password = process.env.AUTH_KEY;
const cluster = 'project9227';
const dbname = 'project9927';

/**
 * Starts the database and returns the db object
 * @returns {Promise<mongoose.Connection>} Database connection object
 */
function startDatabase(){
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,{
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
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
    model.save(function(err) {
        if(err) return;
    })
}

/**
 * Check if a user exists by username
 * @param {string} username Username to check
 * @returns {boolean} Exists
 */
async function userExists(username) {
    return await User.findOne({username}).exec() !== null;
}

module.exports = {
    startDatabase,
    saveModel,
    userExists
}
