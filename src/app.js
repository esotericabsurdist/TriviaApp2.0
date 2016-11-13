'use strict';
//configuring dependencies file
var express = require('express');
var parser = require('body-parser');
var router = require('./trivia/router.js');

var app = express();

//run these scripts in order they are required
require('./database');
require('./seed');

app.use('/', express.static('public'));
app.use(parser.json());

app.use('/', router);

app.listen(3000, function() {
  console.log("The server is running on port 3000");
});


//socket io server
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(4200);//server.listen(process.env.PORT || 4200);
// listen for connection
io.sockets.on('connection', function(client) {

    console.log('Client connected...');

    //if client says 'join', get their data and print it to the console.
    client.on('join', function(data) {
        console.log(data);
    });

});
