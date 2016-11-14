// user name.
//USER_NAME = 0;
//ANSWER_ID = 0;

var main = function() {

  // setup connection
  var socket = io.connect('http://localhost:4200');

  //        ********** Onclick Listeners **********

  // join user to trivia game.
  document.getElementById('submit_user_name_button').onclick = function() {
    // get username.
    var user_name = document.getElementById('user_name').value;

    // if the user name is in the field, join them.
    if( !(user_name == "" || user_name == null) ){

      // Send the user the server.
      socket.emit('join_user', {name: user_name});
    }
  }

  // submit trivia answer
  document.getElementById('submit_trivia_answer_button').onclick = function(){
    // get user's answer from input field.
    var answer_text = document.getElementById('user_answer_text').value;

    console.log("here is the anser ID inside submit answer: "+window.ANSWER_ID);

    // build object to send to the api.
    var answer_data = {
      "answerID": window.ANSWER_ID,
      "answer": answer_text
    }

    console.log(answer_data);

    // send a POST request to our api to check if the user's answer is correct.
    $.ajax({
      url: '/answer',
      type: 'POST',
      data: JSON.stringify(answer_data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(answer_response){
          // posts to /answer returns answer_response in this format: { "correct" : true}

          console.log("here is the the response of posting the answer: "+answer_response);

          // tell server the question has been answered and send the answer.
          socket.emit('answer', answer_response);
        }
    });
  }


  document.getElementById('get_question').onclick = function(){
    // make an ajax GET to our API for a random question.
    get_question();
  }

  var get_question = function (){
    // send a GET request to our api for a random question.
    $.ajax({
      url: '/question',
      type: 'GET',
      dataType: "json",
      success: function(trivia){

          if(trivia != null){
            // tell the server that there is a new question.
            socket.emit('question', trivia);
          }
          else{
            document.getElementById('question').innerHTML = "null response, something went wrong.";
          }
      }
    });
  }






  //        ********** Socket Listeners **********

  // when the server emits a new user update, update the online user list.
  socket.on('new_user', function(user){
    // add the username to the users list
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(user.name));
    document.getElementById('online_users').appendChild(li);
  });


  // when the server emits a trivia_announcement, post the trivia questions in the view.
  socket.on('trivia_announcement', function(trivia){
    if(trivia != null){

      // update the html with our trivia.
      document.getElementById('trivia_question').innerHTML = trivia.question;

      // save the id.
      window.ANSWER_ID = trivia.answerID;

    }
    else{
      document.getElementById('trivia_question').innerHTML = "null response, something went wrong.";
    }
  });

  // when the server emits the correctness of answer, update the view.
  socket.on('answer_announcement', function(answer_data){
    //TODO write th user's name to the name text in the view.

    if(answer_data != null){
      console.log(answer_data);
      var answer = JSON.parse(answer_data);
      // write the users answer to the answer text in the view.
      document.getElementById('user_submitted_answer').innerHTML = answer.correct;
    }
    else {
      document.getElementById('user_submitted_answer').innerHTML = "user submitted answer, null response from server";
    }

  });


}

$(document).ready(main);
