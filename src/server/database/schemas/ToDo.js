class ToDoClass {
    constructor(team = false) {
        this.team = team;
        this.owner = '';
    }

    setOwner(owner) {
        this.owner = owner;
    }
}

module.exports = {
    ToDoClass
}