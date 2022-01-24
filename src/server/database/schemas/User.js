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
        required: false
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
        required: false,
        default: false
    },
    uuid: {
        type: Schema.Types.ObjectId,
        required: false
    },
    teams: {
        type: Schema.Types.Array,
        required: false
    },
    to_do: {
        type: "object",
        required: true,
    },
    visible: {
        type: Schema.Types.Boolean,
        default: true,
    }
});

const UserModel = mongoose.model('UserModel', UserSchema);

module.exports = UserModel;