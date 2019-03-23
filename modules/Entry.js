class Entry {
    constructor(id, author){
        this.id = id;
        this.users = Array();
        this.users.push(author);
    }
}


module.exports = Entry;