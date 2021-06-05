const { User } = require('../models/objects');
const playerdb = require('../db/playerdb');
const { Score } = require('../models/objects');

const loginService = (username, password, callback) => {
    //check if the user is in the DB
    playerdb.checkPass(username, password, function(err, rows) {
        if (rows.length == 0) {
            //the user is not in the DB
            console.log("no  user found with this name");
            callback(true, null);
        } 
        else if(rows == 0) {
            console.log("password is wrong lolll");
            callback(true, null);
        }else {
            console.log(`Selected user; ${rows[0].id}, ${rows[0].name}, ${rows[0].pass} `);
            user = {id:rows[0].id, username:rows[0].name, password:rows[0].pass};
            
            callback(null, user);
        }
    });
};

const registerService = (username, password, callback) => {
    playerdb.findByUsername(username, function(err, rowsuser) {
        if (rowsuser.length != 0) {
            //already in db
            console.log("this username is already taken");
            callback(false, null);
        } else {
            //insert in db
            playerdb.createUser(username, password, function(err, count, id) {
                if (count == 0) {
                    //the user has not been inserted
                    console.log("user has not been inserted");
                    callback(true, null);
                } else {
                    console.log(`User has been inserted id= ${id}`);
                    // user = {id:id, username:username, password:password, score:0};
                    user = new User(id, username, password);
                    callback(null, user);
                }
            });
        }
    });
};

const newLeaderService = (username, score, callback) => {
    console.log("already in");
    playerdb.findByUsername(username, function(err, result) {
        playerdb.createScore(username, score, function(err, result) {
            if (result.length != 0) {
                score = new Score(username, score);
                callback(null, result);//numbers
            } else {
                callback(true, result);
            }
        });
    });
};

const scoreService = (callback) => {
    playerdb.displayscores(function(err, scoreData) {
        if (scoreData.rows != 0) {
            callback(null, scoreData);
        } else {
            callback(true, null);
        }
    });
};

const searchService = function(callback) {
    playerdb.find(function(err, rows) {
        if (rows.length == 0) {
            console.log("No users!");
        } else {
            callback(null, rows);
        }
    });
};

const searchIDService = function(id, callback) {
    playerdb.findById(id, function(err, rows) {
        if (rows.length == 0) { //unkown
            console.log("Unknown user!");
            let user = null;
            callback(null, user);
        } else {

            let user = new User(rows[0].id, rows[0].name, rows[0].pass);
            callback(null, user);
        }
    });
};

const deleteService = function(id, callback) {
    let count = playerdb.deleteUser(id, function(err, count) {
        if (count === 0) { //unkown
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
    searchService,
    searchIDService,
    newLeaderService,
    deleteService,
    scoreService
};
