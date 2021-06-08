// module.exports = signin;
const express = require('express');
//const app = express();
const usercontrol = require('../control/usercontrol');


//define a router and create routes
const router = express.Router();
//create a route for /api/register
router.post('/api/register', usercontrol.registerCtrl);

//create a route for /api/login
router.post('/api/login', usercontrol.loginCtrl);

//create a route for /api/leaderboard
router.post('/api/leaderboard', usercontrol.leaderScoreCtrl);

//create a route for /api/leaderboardUpdate
router.post('/api/leaderboardUpdate', usercontrol.leaderCtrl);

//create a route for /api/getScore
router.post('/api/getScore', usercontrol.score);

//export router
module.exports = router;
