'use strict';
var http = require('http');
var express = require('express'),
        bodyparser = require('body-parser'),
        morgan = require('morgan'),
        //port =server.listen(process.env.PORT || 3000),
        app = express(),
        dbConnection = '';
var port=process.env.PORT || 3000;
http.createServer(app).listen( port, function() {
    console.log('Express app started'+port);
});

app.get('/', function(req, res) {
    res.send('Welcome!');
});//
app.use(bodyparser.json());
app.use(morgan('dev'));
//gives the static pages access
app.use(express.static(__dirname + '/public'));
//requiring the routes
require('./app/services/server.service.js');
require('./app/routes/server.routes.js')(app);

app.get("/dashboard.html",function(req,res){
res.sendFile(__dirname + "/public/views/" + "dashboard.html");
});
app.get("/truliatrends.html",function(req,res){
res.sendFile(__dirname + "/public/views/" + "truliatrends.html");
})

// app.listen(port, function () {
//     console.log('Server on port', port);
// });

module.exports.app = app;