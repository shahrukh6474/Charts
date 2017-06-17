var tableModel = require('../models/server.model.js'),
    connection = require('../../config/env/env.js');
//connection = require('../services/server.service.js').connection;

exports.testAPI = function (req, res) {
    res.send('Hello Test API data..!');
};
//callAsync.js

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


