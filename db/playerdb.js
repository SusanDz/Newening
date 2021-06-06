var SQL = require('sql-template-strings');
const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "root",
    database: "database",
    debug: true
});
// //for when the server disconnects
// pool.query('select 1 + 1', (err, rows) => { /* */ });
// pool.query('SELECT 1 + 1', function(err, rows) {
//     if (err) throw err;
  
//     console.log('The solution is: ', rows[0].solution);
//   });try this laterrrrrrrrrrrr

// Attempt to catch disconnects 
pool.on('connection', function(connection) {
    console.log('Connection established');
    // Below never get called
    connection.on('error', function(err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    connection.on('close', function(err) {
        console.error(new Date(), 'MySQL close', err);
    });
});

function executeQuery(query, callback) {
    pool.getConnection(function(err, connection) {
        if (err) {
            return callback(err, null);
        } else if (connection) {
            connection.query(query, function(err, rows, fields) {
                connection.release();
                if (err) {
                    return callback(err, null);
                }
                return callback(null, rows);
            });
        } else {
            return callback(true, "No Connection");
        }
    });
}


function getResult(query, callback) {
    executeQuery(query, function(err, rows) {
        if (!err) {
            callback(null, rows);//[0].password);
        } else {
            callback(true, err);
        }
    });
}

function find(callback) {
    const selectUsers = "SELECT * from database.users; ";//database.user
    getResult(selectUsers, function(err, rows) {
        if (!err) {
            callback(null, rows);
        } else {
            console.log(err);
        }
    });
}

function findByUsername(username, callback) {
    const selectUser = (SQL `SELECT * from database.users WHERE name LIKE ${username};`);//where like
    getResult(selectUser, function(err, result) {
        if (!err) {
            //User already exists
            if (result.length != 0) {
                if (result[0].name === username) {
                    callback(true, result);
                }
            } else {
                callback(false, 0);
            }
        } else {
            console.log(err);
        }
    });
}

function findByUsernameLeader(username, callback) {
    const selectUser = (SQL `SELECT * from database.leaderboard where username like ${username};`);
    getResult(selectUser, function(err, rows) {
        if (!err) {
            callback(null, rows);
        } else {
            console.log(err);
        }
    });
}

function findById(id, callback) {
    const selectUser = (SQL `SELECT * from database.users where id = ${id};`);
    getResult(selectUser, function(err, rows) {
        if (!err) {
            callback(null, rows);
        } else {
            console.log(err);
        }
    });
}

function createUser(name, pass, callback) {//score
    console.log('CREATE USER ; ' + name + ', ' + pass) //score
    const insertBoard = (SQL `INSERT INTO database.leaderboard (name, score) VALUES (${name}, 0) ;`);//score
    getResult(insertBoard);
    
    const insertUser = (SQL `INSERT INTO database.users (name, pass) VALUES (${name}, ${pass}) ;`);//score
    getResult(insertUser, function(err, result) {
        if (!err) {
            callback(null, result.affectedRows, result.insertId);
        } else {
            console.log(err);
        }
    });
}

function deleteUser(name, callback) {
    const insertUser = (SQL `DELETE from database.users where name = ${name};`);
    getResult(selectUser, function(err, result) {
        if (!err) {
            console.log("Number of users inserted: " + result.affectedRows);
            callback(null, result.affectedRows);
        } else {
            console.log(err);
        }
    });
}

function updateScore(username, score, callback) {
    const insertScore = (SQL `UPDATE database.leaderboard SET score=(${score}) WHERE name LIKE ${username} ;`);
    getResult(insertScore, function(err, result) {
        if (!err) {
            callback(null, result);
        } else {
            console.log(err);
        }
    });
}

function checkPass(username, password, callback) {
    const selectUser = (SQL `SELECT * from database.users WHERE name LIKE ${username};`);
    getResult(selectUser, function(err, rows) {
        if (!err) {
            //User exists
            if (rows.length != 0) {
                // pass is correct
                if (rows[0].pass === password) {
                    callback(null, rows);
                } else {
                    callback(false, 0);
                }
            } else {
                callback(false, null);//numberrrrrrssss
            }
        } else {
            console.log(err);
        }
    });
}

function createScore(username, score, callback) {
    const insertScore = (SQL `INSERT INTO database.leaderboard (name, score) VALUES (${username}, ${score}) ;`);
    getResult(insertScore, function(err, result) {
        if (!err) {
            callback(null, result);
        } else {
            console.log(err);
        }
    });
}


function displayscores(callback) {
    const selectPlayer = (SQL `SELECT name,score FROM database.leaderboard ORDER BY score DESC LIMIT 5;`);
    getResult(selectPlayer, function(err, rows) {
        if (!err) {
            callback(null, rows);
        } else {
            console.log(err);
        }
    });
}

module.exports = {
    find,
    findByUsername,
    findByUsernameLeader,
    findById,
    createUser,
    deleteUser,
    updateScore,
    checkPass,
    createScore,
    displayscores
};
