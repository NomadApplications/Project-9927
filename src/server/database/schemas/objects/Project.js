const mongoose = require('mongoose');
const database = require('../../database');
const User = require('../User');
const Team = require('../Team');
const ToDo = require('./ToDo').ToDoClass;

class Project {
    async setOwnerId(ownerId){
        if(!mongoose.Types.ObjectId.isValid(ownerId)) return this.ownerId = '';
        const o = await User.findOne({_id: ownerId}).exec();
        this.ownerId = o === null ? '' : o;
        return true;
    }

    async setTeamId(teamId) {
        if(!mongoose.Types.ObjectId.isValid(teamId)) return this.teamId = '';
        const t = await Team.findOne({_id: teamId}).exec();
        this.teamId = t === null ? '' : t;
        return true;
    }

    async initialize(ownerId, teamId = ''){
        await this.setOwnerId(ownerId);

        this.teamProject = teamId !== '';
        if(this.teamProject) await this.setTeamId(teamId);

        this.toDo = new ToDo().initialize(this.ownerId, this.teamId, this.teamProject);

        return this;
    }
}

(async () => {
    const p = await new Project().initialize('', 'test');
    console.log(p);
})();

module.exports = Project;