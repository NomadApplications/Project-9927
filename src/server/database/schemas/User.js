const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToDo = require('./ToDo');

const UserSchema = new Schema({
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    display_name: {
        type: Schema.Types.String,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true
    },
    email_list: {
        type: Schema.Types.Boolean,
        required: true,
        default: true
    },
    teams: {
        type: Schema.Types.Array,
        required: true
    },
    to_do: {
        type: Schema.Types.Array,
        required: true,
    },
    projects: {
        type: Schema.Types.Array,
        required: true
    },
    visible: {
        type: Schema.Types.Boolean,
        default: true,
    },
    verified: {
        type: Schema.Types.Boolean,
        default: false,
        required: true,
    },
    verification_code: {
        type: Schema.Types.String,
    }
});

const UserModel = mongoose.model('UserModel', UserSchema);

module.exports = UserModel;