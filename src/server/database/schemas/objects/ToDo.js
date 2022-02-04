const mongoose = require('mongoose');
const Team = require('../Team');
const User = require('../User');

class ToDoClass {
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

    async initialize(ownerId, teamId = '', teamList = false){
        await this.setOwnerId(ownerId);
        await this.setTeamId(teamId);
        this.teamList = teamList;

        return this;
    }
}

module.exports = {
    ToDoClass
}