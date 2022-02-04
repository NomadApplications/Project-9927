const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    visible: {
        type: Schema.Types.Boolean,
        default: true,
    },

    projects: {
        type: Schema.Types.Array
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

module.exports = mongoose.model('UserModel', UserSchema);