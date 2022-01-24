const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToDo = require('./ToDo');

const TeamSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    to_do: {
        type: Schema.Types.Map,
        required: false,
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
        type: Schema.Types.Array,
        required: false,
    },
    uuid: {
        type: Schema.Types.ObjectId,
        required: false
    }
});

const TeamModel = mongoose.model('TeamModel', TeamSchema);

module.exports = TeamModel;