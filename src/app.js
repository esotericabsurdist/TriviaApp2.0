'use strict';
//configuring dependencies file
var express = require('express');
var parser = require('body-parser');
var router = require('./trivia/router.js');
var app = express();

//run these scripts in order they are required
require('./database');
require('./seed'); // populate mongo database with some trivia.

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
    client.on('join_user', function(user) {
        // emit new user to all
        io.emit('new_user', user);
    });

    client.on('question', function(trivia){
      // emit new question to all
      io.emit('trivia_announcement', trivia);
    });

    client.on('answer', function(answer){
      // TODO include user name and broadcast with the user's answer.
      // TODO update REDIS correct answer count. Include this with the answer annoucement?
      // emit the answer to all clients the user's answer.
      console.log('Here is the user\'s answer: ' + answer);
      io.emit('answer_announcement', answer);
    });

});


io.sockets.on('disconnect', function(client) {
    console.log('Client disconnected...');
});
