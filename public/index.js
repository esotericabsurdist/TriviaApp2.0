var connect = function() {
  // set up connection.
  var socket = io.connect('http://localhost:4200');
  //connect, then run call back function.
  socket.on('connect', function(data) {
        // send string to server.
        socket.emit('join', 'Activate Subsonic Bass');
  });
};
$(document).ready(connect);
