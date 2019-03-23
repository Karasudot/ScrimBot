const { LoggerFactory } = require('logger.js');
const logger = LoggerFactory.getLogger('listing', 'cyan');
const Entry = require('./entry');

class Listing {

    constructor(){  
        // Array of entry's
        this.data = Array();

        // All the users
        this.users = Array();
    }

    // Check to see if user is already present
    userPresent(username){
        logger.info("userPresent called");

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
        logger.info("idPresent called");

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
        logger.info("addUser called");

        for (let i = 0; i < this.data.length; i++){
            if (this.data[i].id === id){
                this.data[i].users.push(username);
                this.users.push(username);
                return;
            }
        }
    }

    // New id
    addID(id, username){
        logger.info("newId called");
        this.data.push(new Entry(id,username));
        this.users.push(username);
    }

    // Find and delete username from users array
    deleteUser(username){
        logger.info("deleteUser called");

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
        logger.info("deleteUserEntry called");

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