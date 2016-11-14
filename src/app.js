'use strict';
//configuring dependencies file
var express = require('express');
var parser = require('body-parser');
var router = require('./trivia/router.js');
var redis = require("redis"); //require redis module
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

    //if client says 'join', get their data broadcast it to all other sockets so that online user's will be updated.
    client.on('join', function(user) {

        // print to console.
        console.log("adding user: "+user.name);

        // broadcast emit to all other online users except for the sender. DOES NOT WORK!?
        //client.broadcast.emit('new_user', user);

        // emit new user to all
        io.emit('new_user', user);

    });


});
