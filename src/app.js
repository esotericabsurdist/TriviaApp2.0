//===================================================================================
//configuring dependencies file
var express = require('express');
var parser = require('body-parser');
var router = require('./trivia/router.js');
var app = express();
//===================================================================================
//run these scripts in order they are required
require('./database');
require('./seed'); // populate mongo database with some trivia.
//===================================================================================
app.use('/', express.static('public'));
app.use(parser.json());
//===================================================================================
// all GETS, PUTS, POSTS handled by our API from project4 in router.js
app.use('/', router);
app.listen(3000, function() {
  console.log("The server is running on port 3000...");
});
//===================================================================================

//socket io server
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(4200);

//===================================================================================
// listen for connection
io.sockets.on('connection', function(client) {

    console.log('Client connected...');

    //if client says 'join', get their data broadcast it to all other sockets so that list of online user's will be updated.
    client.on('join_user', function(user) {
        // emit new user to all
        io.emit('new_user_announcement', user);
    });

    // send the question to all the clients.
    client.on('question', function(trivia){
      // emit new question to all
      io.emit('trivia_announcement', trivia);
    });

    // send the answer data to all the clients.
    client.on('answer', function(answer){
      // this answer data contains the correctness of the answer, and the user name of the client who submitted it.
      io.emit('answer_announcement', answer);
    });

    // send the score to all the clients.
    client.on('score', function(score){
      io.emit('score_announcement', score);
    });

});
//===================================================================================
io.sockets.on('disconnect', function(client) {
    console.log('Client disconnected...');
});
//===================================================================================
