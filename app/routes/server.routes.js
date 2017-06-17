'use strict';
var apiController = require('../controllers/server.controller.js');
module.exports = function (app) {
    app.get('/test', apiController.testAPI);
 
        

}