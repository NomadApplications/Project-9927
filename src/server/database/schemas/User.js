const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: Schema.Types.String,
        required: true
    },
    display_name: {
        type: Schema.Types.String,
        required: false
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    uuid: {
        type: Schema.Types.ObjectId,
        required: false
    },
    teams: []
});

const UserModel = mongoose.model('UserModel', UserSchema);

module.exports = UserModel;