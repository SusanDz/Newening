const { User } = require('../models/objects');
const playerdb = require('../db/playerdb');
const { Score } = require('../models/objects');

const loginService = (username, password, callback) => {
    //check if the user is in the DB
    playerdb.checkPass(username, password, function(err, rows) {
        if (rows === null) {
            //the user is not in the DB -- return 0
            console.log("no  user found with this name");
            callback(true, 0);
        } 
        else if(rows == 0) {
            //if password given is incorrect -- return null
            console.log("password is wrong lolll");
            callback(true, null);
        }else {
            //if username and password match -- return the details
            console.log(`Selected user; ${rows[0].id}, ${rows[0].name}, ${rows[0].pass} `);
            user = {id:rows[0].id, username:rows[0].name, password:rows[0].pass};
            
            callback(null, user);
        }
    });
};

const registerService = (username, password, callback) => {
    playerdb.findByUsername(username, function(err, rowsuser) {
        if (rowsuser != 0) {
            //username already taken -- return null
            console.log("this username is already taken");
            callback(false, null);
        } else {
            //username not taken then create a new user
            playerdb.createUser(username, password, function(err, count, id) {
                if (count == 0) {
                    //the user has not been inserted -- return null
                    console.log("user has not been inserted");
                    callback(true, null);
                } else {
                    //user successfully created
                    console.log(`User has been inserted id= ${id}`);
                    user = new User(id, username, password);
                    callback(null, user);
                }
            });
        }
    });
};

const updateLeaderService = (username, score, callback) => {
    //check if the user exists
    playerdb.findByUsername(username, function(err, result) {
        if (result.length == 0) {
            console.log("User doesn't exist in the database");
            //User doesn't exist -- return '0'
            callback(false, 0);
        }
        //if user exists update the user with the new score
        playerdb.updateScore(username, score, function(err, result) {
            if (result.length != 0) {
                scores = new Score(username, score);
                callback(null, scores);
            } else {
                //No record updated -- return null
                callback(true, null);
            }
        });
    });
};

//return the top 5 user details in leaderboard
const displayService = (callback) => {
    playerdb.displayscores(function(err, scoreData) {
        if (scoreData.rows != 0) {
            callback(null, scoreData);
        } else {
            callback(true, null);
        }
    });
};

//Return details of all records in database
const searchService = function(callback) {
    playerdb.allUsers(function(err, rows) {
        if (rows.length == 0) {
            console.log("No users!");
        } else {
            callback(null, rows);
        }
    });
};

//Return details of user by given id
const searchIDService = function(id, callback) {
    playerdb.findById(id, function(err, rows) {
        if (rows.length == 0) {
            console.log("Unknown user!");
            let user = null;
            callback(null, user);
        } else {
            let user = new User(rows[0].id, rows[0].name, rows[0].pass);
            callback(null, user);
        }
    });
};

//Return score for given username
const getScoreService = (username,callback) => {
    //check if user exists
    playerdb.findByUsername(username, function(err, result) {
        if (result.length == 0) {
            console.log("User doesn't exist in the database");
            callback(false, 0);
        }
        //return the details of the username in leaderboard
        playerdb.getScore(username, function(err, result) {
            callback(null, result);

        });
    });
};

//Return record details if score in leaderboard is less than score user got just now from playing
const checkScoreService = (username, score, callback) => {
    playerdb.findByUsername(username, function(err, result) {
        if (result.length == 0) {
            console.log("User doesn't exist in the database");
            callback(false, 0);
        }
        playerdb.getScore(username, function(err, result) {
            if (result.length != 0) {
                if(result[0].score < score) {
                    callback(null, result);
                } else {
                    callback(false, null);
                }
            } else {
                callback(true, null);
            }
        });
    });
};

//Return true if user record is deleted
const deleteService = function(username, callback) {
    playerdb.deleteUser(username, function(err, count) {
        if (count === 0) {
            console.log("No user deleted!");
            callback(null, false);
        } else {
            callback(null, true);
        }
    });
};

module.exports = {
    loginService,
    registerService,
    updateLeaderService,
    displayService,
    searchService,
    searchIDService,
    getScoreService,
    checkScoreService,
    deleteService
};
