'use strict';

var mysql = require('mysql'),
        config = require('../../config/env/env.js');

var connection = mysql.createConnection({
    host: config.db.url,
    user: config.db.username,
    password: config.db.password,
    database: config.db.db
});
//exports.dbConnectionService = function () {
// connection.connect(function (err) {
//     if (err) {
//         console.log('Error in connecting to DB', err);
//     } else {
//         console.log('You are now connected to DB...');
//     }
// });

//};
//module.exports.connection = connection;