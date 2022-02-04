const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    owner: {type: Schema.Types.ObjectId },
    name: {
        type: Schema.Types.String,
        required: true,
    },
    members: {
        type: Schema.Types.Array,
        required: true
    },
    theme: {
        type: Schema.Types.String,
        required: false,
        default: 'green'
    },
    projects: {
        type: Schema.Types.Array
    },
    team_code: {
        type: Schema.Types.String,
        required: true,
    }
});

module.exports = mongoose.model('TeamModel', TeamSchema);;