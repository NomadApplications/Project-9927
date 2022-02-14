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
    to_do: {
        type: Schema.Types.String,
        default: JSON.stringify({
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
    }
});

module.exports = mongoose.model('ProjectModel', ProjectSchema);