const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    team_id: {
        type: Schema.Types.ObjectId,
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});

module.exports = mongoose.model('ProjectModel', ProjectSchema);