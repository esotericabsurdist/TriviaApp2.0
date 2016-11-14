var main = function() {

  // setup connection
  var socket = io.connect('http://localhost:4200');


  // join user to trivia game.
  document.getElementById('submit_user_name_button').onclick = function() {
    // get username.
    var user_name = document.getElementById('user_name').value;

    // if the user name is in the field, join them.
    if( !(user_name == "" || user_name == null) ){

      // Send the user.
      socket.emit('join', {name: user_name});
    }
  }



  // submit trivia answer
  document.getElementById('submit_trivia_answer_button').onclick = function(){
    //TODO
    // ajax post to /answer.
    // Get result in call back: {correct: true || false}
    // socket.emit('user_answer_status' {correct: true || false, name: user_name})
    //
  }





  // update the user list when a new user joins.
  socket.on('new_user', function(user){

    document.getElementById("trivia_question").innerHTML = "asdfasdfj;asdf;ajsdf;ljasdf;lj"

    // add the username to the users list
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(user.name));
    document.getElementById('online_users').appendChild(li);
    
  });




};
$(document).ready(main);
