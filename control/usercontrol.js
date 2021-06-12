//Login the user
const loginCtrl = (request, response, next) => {
const loginServices = require('../services/userServices');
    let name = request.body.username;
    let pass = request.body.password;

    loginServices.loginService(name, pass, function(err, user) {
        console.log("User that logged in :");
        if (user === null) {
            console.log("Authentication problem!");
            response.json(null);
        } else if(user === 0) {
            response.json(0);
        } else {
            //here you have to add the user to the session
            console.log("UserControl = user:", user);
            response.json(user);
            // sessionName = request.session.username;
            // request.session.username = name;
            // console.log("session name:", request.session.username);//these 2 lines
            //response.json(sessionName);
        }

        response.end();
        next();
    });
};

//Register the user
const registerCtrl = (request, response, next) => {
    const loginServices = require('../services/userServices');

    let username = request.body.username;
    let password = request.body.password;

    loginServices.registerService(username, password, function(err, user) {
        console.log("Inserting user in DB");
        if (user === null) {
            console.log("User insertion problem!");
            response.json(null);
        } else {
            //here you should add the username to the session
            response.json(user);
        }
        response.end();
        next();
    });
};

//Return details of all users
const getUsers = (request, response) => {
    const loginServices = require('../services/userServices');
    loginServices.searchService(function(err, rows) {
        response.json(rows);
        response.end();
    });
};

//Update leaderboard with new score
const leaderCtrl = (request, response) => {
    const loginServices = require('../services/userServices');
    let username = request.body.username;
    let score = request.body.score;

    loginServices.updateLeaderService(username, score, function(err, rows) {
        response.json(rows);
        response.end();
    });
};

//Display top 5 players
const leaderScoreCtrl = (request, response) => {
    const loginServices = require('../services/userServices');
    loginServices.displayService(function(err, rows) {
        response.json(rows);
        response.end();
    });
};

//Return score of given user
const getScore = (request, response) => {
    const scoreServices = require('../services/userServices');
    let username = request.body.username;

    scoreServices.getScoreService(username, function(err, rows) {
        response.json(rows);
        response.end();
    });
};

//Return score of user if leaderBoard score less than new score
const checkScore = (request, response) => {
    const scoreServices = require('../services/userServices');
    let username = request.body.username;
    let score = request.body.score;

    scoreServices.checkScoreService(username, score, function(err, rows) {
        if (rows === null) {
            console.log("Their curent score is Greater than what they just got!");
            response.json(null);
        } else {
            response.json(rows);
        }
        response.end();
    });
};

//Return details of user by given id
const getUserByID = (request, response) => {
    const loginServices = require('../services/userServices');
    let id = request.params.id;
    loginServices.searchIDService(id, function(err, rows) {
        response.json(rows);
        response.end();
    });
};

module.exports = {
    loginCtrl,
    registerCtrl,
    getUsers,
    getUserByID,
    leaderCtrl,
    leaderScoreCtrl,
    getScore,
    checkScore
};
