//entry point file of the server

console.log("This is working");

const express = require('express');
var session = require('express-session');
const favicon = require('serve-favicon');
const app = express();
const path = require('path');
const cookie = require('cookie-parser');

//define a session
app.use(session({
  secret: 'your secrete word goes here',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));

//set the port to be 3000
app.use(express.urlencoded({ extended: false}))
const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
    console.log(`listening on port : ${port}`);
});

//create a socket for the server
const io = require('socket.io')(server);

//send the static file
//make a route for homepage
app.use(express.static('client'));
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

// middleware
app.use(express.json());
app.use(express.urlencoded());

const router = require('./routes/routes');
// defining routes
  app.use(router);

//create database if not exists
const initDB = require('./db/db');
initDB();