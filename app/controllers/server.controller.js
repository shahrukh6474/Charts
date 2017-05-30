var tableModel = require('../models/server.model.js'),
    connection = require('../../config/env/env.js');
connection = require('../services/server.service.js').connection;

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
exports.getPieChartDataAPI = function (req, res) {
    var from_time_stamp = req.query.from_time_stamp == null ? null : formatDate(req.query.from_time_stamp) ;
    var to_time_stamp = req.query.to_time_stamp == null ? null : formatDate(req.query.to_time_stamp);
    connection.query("CALL ScoreRangeDonut(" + from_time_stamp + ", " + to_time_stamp + ")",
        function (err, data) {
            if (err) {
                console.log(err, 'Error in getting data');
                res.send(err);
            } else {
                console.log('getPieChartDataAPI...Got data Successfully!!!');
                res.send(data[0]);
            }
        });
};

exports.getBarGraphDataAPI = function (req, res) {
    var requestedId = req.query.id;
    var from_time_stamp = req.query.from_time_stamp == null ? null : formatDate(req.query.from_time_stamp) ;
    var to_time_stamp = req.query.to_time_stamp == null ? null : formatDate(req.query.to_time_stamp);

    connection.query("CALL ScoreRangeDonutDrillDown(" + requestedId + ", " + from_time_stamp + ", " + to_time_stamp + ")",
        function (err, data) {
            if (err) {
                console.log(err, 'Error in getting data');
                res.send(err);
            } else {
                console.log('getBarGraphDataAPI...Got data Successfully!!!');
                res.send(data[0]);
            }
        });
}

exports.getSubRangeUsersAPI = function (req, res) {
    var range = req.query.rangeVal;
    var fromVal = range.substring(0, range.indexOf('-'));
    var toVal = range.substring(range.indexOf('-') + 1, range.length);
    var from_time_stamp = req.query.from_time_stamp == undefined ? 'NULL' : formatDate(req.query.from_time_stamp);
    var to_time_stamp = req.query.to_time_stamp == undefined ? 'NULL' : formatDate(req.query.to_time_stamp);

    connection.query('call Get_User_DrillDown_Driving_Range(' + from_time_stamp + ',' + to_time_stamp + ',' + fromVal + ',' + toVal + ')', function (err, data) {
        if (err) {
            console.log(err, 'Error in getting data');
            res.send(err);
        } else {
            console.log('Got data Successfully!!!');
            //console.log(data);
            res.send(data[0]);
        }
    });
}
exports.getUserAverageData = function (req, res) {
    var from_time_stamp = req.query.from_time_stamp == undefined ? 'NULL' : formatDate(req.query.from_time_stamp);
    var to_time_stamp = req.query.to_time_stamp == undefined ? 'NULL' : formatDate(req.query.to_time_stamp);

    connection.query('call Get_User_Driving_Range(' + from_time_stamp + ',' + to_time_stamp + ')', function (err, data) {
        if (err) {
            console.log(err, 'Error in getting data');
            res.send(err);
        } else {
            console.log('Got data Successfully!!!');
            res.send(data[0]);
        }
    });
}

exports.getCumulativeChartData = function (req, res) {
    var from_time_stamp = formatDate(req.query.from_time_stamp);
    var to_time_stamp = formatDate(req.query.to_time_stamp);

    if (req.query.from_time_stamp != undefined && req.query.to_time_stamp != undefined) {

        var query = ' select * from (Select COUNT(id) AS registered_count,MONTHNAME(time_stamp) as month ,"Registered" as "identity" from user where time_stamp >= "' + from_time_stamp + '" and time_stamp<= "' + to_time_stamp + '"\
 GROUP BY Month(time_stamp) Union \
 Select COUNT(Distinct(user_id)) AS used_count,MONTHNAME(time_stamp) as month,"Used" as "identity" from user_daily_data where time_stamp >= "'+ from_time_stamp + '" and time_stamp<= "' + to_time_stamp + '" \
 GROUP BY Month(time_stamp)) test';
    }
    else {

        var query = ' select (@sum1 := @sum1 + registered_count) as registered_count, month, identity from (Select COUNT(id) AS registered_count,MONTHNAME(time_stamp) as month ,"Registered" as "identity" from user where time_stamp > DATE_SUB(now(), INTERVAL 6 MONTH) GROUP BY Month(time_stamp)) test cross join (select @sum1 := 0) params Union select (@sum2 := @sum2 + used_count) as running_amount, month, identity from ( Select COUNT(Distinct(user_id)) AS used_count,MONTHNAME(time_stamp) as month,"Used" as "identity" from user_daily_data where time_stamp > DATE_SUB(now(), INTERVAL 6 MONTH)GROUP BY Month(time_stamp) ) Test2 cross join (select @sum2 := 0) params';
    }

    connection.query(query, function (err, data) {
        if (err) {
            console.log(err, 'Error in getting data');
            res.send(err);
        } else {
            console.log('Got data Successfully!!!');
            res.send(data);
        }
    });
}
exports.getgroupbyStates = function (req, res) {
    var from_time_stamp = formatDate(req.query.from_time_stamp);
    var to_time_stamp = formatDate(req.query.to_time_stamp);

    if (req.query.from_time_stamp != undefined && req.query.to_time_stamp != undefined) {

        var query = 'SELECT  u.state, COUNT(DISTINCT ut.user_id) users, Round(AVG(ut.trip_driving_score),1) avg_score\
 FROM user_trip  ut ,user  u where  ut.user_id= u.id and ut.time_stamp between  "'+ from_time_stamp + '" and "' + to_time_stamp + '" Group by u.state';
    } else {
        var query = 'SELECT  u.state, COUNT(DISTINCT ut.user_id) users, Round(AVG(ut.trip_driving_score),1) avg_score\
 FROM user_trip  ut ,user  u where  ut.user_id= u.id and ut.time_stamp > DATE_SUB(now(), INTERVAL 1 MONTH) Group by u.state' ;
    }
    connection.query(query, function (err, data) {
        if (err) {
            console.log(err, 'Error in getting data');
            res.send(err);
        } else {
            console.log('Got data Successfully!!!');
            res.send(data);
        }
    });

}

