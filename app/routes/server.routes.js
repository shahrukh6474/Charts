'use strict';
var apiController = require('../controllers/server.controller.js');
module.exports = function (app) {
    app.get('/test', apiController.testAPI);
    app.get('/pie-chart', apiController.getPieChartDataAPI);
     app.get('/bar-graph', apiController.getBarGraphDataAPI);
      app.get('/sub-range-users', apiController.getSubRangeUsersAPI);
      app.get('/user-travelled-avg-data', apiController.getUserAverageData);
      app.get('/cumulative-chart', apiController.getCumulativeChartData);
      app.get('/state-chart', apiController.getgroupbyStates);
        

}