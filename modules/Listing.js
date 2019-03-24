const { LoggerFactory } = require('logger.js');
const logger = LoggerFactory.getLogger('listing', 'cyan');

class Listing {

    constructor(){  
        // Array of entry's
        this.data = Array();

        // All the users
        this.users = Array();
    }

    // Check to see if user is already present
    userPresent(username){
        logger.debug("userPresent called");

        if (this.users.length > 0){
            for (let i = 0; i < this.users.length; i++){
                if (this.users[i] === username){
                    return true;
                }
            }
        }
        return false;
    }

    // Check to see if id is present
    idPresent(id){
        logger.debug("idPresent called");

        if (this.data.length > 0){
            for (let i = 0; i < this.data.length; i++){
                if (this.data[i].id === id){
                    return true;
                }
            }
        }
        return false;
    }

    // new user
    addUser(id,username){
        logger.debug("addUser called");

        const data = this.data.filter(d => d.id === id)[0];
        data.users.push(username);
        this.users.push(username);
    }

    // New id
    addID(id, userid){
        logger.debug("addID called");
        this.data.push({id: id, users: [userid]});
        this.users.push(userid);
    }

    // Find and delete username from users array
    deleteUser(username){
        logger.debug("deleteUser called");

        for (let i = 0; i < this.users.length; i++){
            if (this.users[i] === username){
                const tmp = this.users[i];
                this.users[i] = this.users[0];
                this.users[0] = tmp;
                this.users.shift();
                return;
            }
        }
    }


    //Deletes users and id's
    deleteUserEntry(username){
        logger.debug("deleteUserEntry called");

        if (this.data.length > 0 && this.users.length > 0){
            //Delete the entry when only one id and username is found
            if (this.data.length === 1 && this.data[0].users.length === 1 && this.data[0].users[0] === username){
                this.data.pop();
                this.users.pop();
            } else {
                for (let i = 0; i < this.data.length; i++){
                    if (this.data[i].users.length > 0){
                        for (let j = 0; j < this.data[i].users.length; j++){
                            if (this.data[i].users[j] === username && this.data[i].users.length > 1){
                                const tmp = this.data[i].users[j];
                                this.data[i].users[j] = this.data[i].users[0];
                                this.data[i].users[0] = tmp;

                                const deletedUser = this.data[i].users.shift();
                                logger.info(`Deleted user : ${deletedUser}`);
                                this.deleteUser(username);
                                return;
                            } else if (this.data[i].users.length === 1 && this.data[i].users[0] === username){
                                const tmp2 = this.data[i];
                                this.data[i] = this.data[0];
                                this.data[0] = tmp2;

                                const deletedID = this.data.shift();
                                logger.info(`deleted id : ${deletedID}`);
                                this.deleteUser(username);
                                return;
                            }
                            
                        }
                    }
                }
            }
        }
    }
    // sorts Entry with most users
    sort() {
        if (this.data.length >= 2){
            for (let i = 0; i < this.data.length - 1; i++){
                for (let j = i + 1; j < this.data.length; j++){
                    if (this.data[i].users.length < this.data[j].users.length){
                        const tmp = this.data[i];
                        this.data[i] = this.data[j];
                        this.data[j] = tmp;
                    }
                }
            }
        }
    }


}



module.exports = Listing;