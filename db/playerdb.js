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
            callback(null, rows);
        } else {
            callback(true, err);
        }
    });
}

function allUsers(callback) {
    const selectUsers = "SELECT * from database.users; ";
    getResult(selectUsers, function(err, rows) {
        if (!err) {
            callback(null, rows);
        } else {
            console.log(err);
        }
    });
}

//Return details of record if username found
function findByUsername(username, callback) {
    const selectUser = (SQL `SELECT * from database.users WHERE name LIKE ${username};`);
    getResult(selectUser, function(err, result) {
        if (!err) {
            //User exists
            if (result.length != 0) {
                if (result[0].name === username) {
                    callback(true, result);
                }
            //User doesn't exist
            } else {
                callback(false, 0);
            }
        } else {
            console.log(err);
        }
    });
}

//Return details of record by given id
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

//Insert new record in leaderboard with initial score '0'
//Insert new record in database and return no. of rows affected
function createUser(name, pass, callback) {
    console.log('CREATE USER ; ' + name + ', ' + pass)
    const insertBoard = (SQL `INSERT INTO database.leaderboard (name, score) VALUES (${name}, 0) ;`);
    getResult(insertBoard);

    const insertUser = (SQL `INSERT INTO database.users (name, pass) VALUES (${name}, ${pass}) ;`);
    getResult(insertUser, function(err, result) {
        if (!err) {
            callback(null, result.affectedRows, result.insertId);
        } else {
            console.log(err);
        }
    });
}

//Delete new record in leaderboard with initial score '0'
//Delete new record in database and return no. of rows affected
function deleteUser(name, callback) {
    const deleteBoard = (SQL `INSERT INTO database.leaderboard (name, score) VALUES (${name}, 0) ;`);
    getResult(deleteBoard);

    const deletetUser = (SQL `DELETE from database.users where name = ${name};`);
    getResult(deleteUser, function(err, result) {
        if (!err) {
            console.log("Number of users deleted: " + result.affectedRows);
            callback(null, result.affectedRows);
        } else {
            console.log(err);
        }
    });
}

//
function checkPass(username, password, callback) {
    const selectUser = (SQL `SELECT * from database.users WHERE name LIKE ${username};`);
    getResult(selectUser, function(err, rows) {
        if (!err) {
            //User exists
            if (rows.length != 0) {
                //pass is correct
                if (rows[0].pass === password) {
                    callback(null, rows);
                } else {
                    //password is incorrect -- return '0'
                    callback(false, 0);
                }
            } else {
                //user doesn't exist -- return null
                callback(false, null);
            }
        } else {
            console.log(err);
        }
    });
}

//Return details of record(score) if username exists in leaderboard
function getScore(username, callback) {
    const selectUser = (SQL `SELECT * from database.leaderboard WHERE name LIKE ${username};`);
    getResult(selectUser, function(err, rows) {
        if (!err) {
            //User exists
            if (rows.length != 0) {
                callback(null, rows);
            } else {
                //User doesn't exist in leaderboard --return null
                callback(false, null);
            }
        } else {
            console.log(err);
        }
    });
}

//Update leaderboard with new score
function updateScore(username, score, callback) {
    const updateScore = (SQL `UPDATE database.leaderboard SET score = ${score} WHERE name = ${username} ;`);
    getResult(updateScore, function(err, result) {
        if (!err) {
            callback(null, result);
        } else {
            console.log(err);
        }
    });
}

//Return score of top 5 players by score in leaderboard
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
    allUsers,
    findByUsername,
    findById,
    createUser,
    deleteUser,
    checkPass,
    getScore,
    updateScore,
    displayscores
};
