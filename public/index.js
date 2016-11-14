var main = function() {

  // user name.
  var USER_NAME = null;
  var ANSWER_ID = null;

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
    var user_answer = document.getElementById('user_answer').value;

    // build a json object to send to the api.
    //var answer = JSON.stringify({'answer': user_answer});

    //var answer = JSON.stringify({'answer': user_answer, 'answerID': ANSWER_ID});
    var answer = {"answerID": ANSWER_ID, "answer": user_answer}

    // send a POST request to our api to check the user's answer is correct.
    $.ajax({
      url: '/answer',
      type: 'POST',
      data: JSON.stringify(answer),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(answer_response){
          // /answer returns data in this format: { "correct" : true}

          // TODO include user name

          // tell server the question has been answered and send the answer.
          socket.emit('answer', answer);
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
            // save the trivia id
            ANSWER_ID = trivia.answerID;

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
      ANSWER_ID = trivia._id;
    }
    else{
      document.getElementById('trivia_question').innerHTML = "null response, something went wrong.";
    }
  });

  // when the server emits the correctness of answer, update the view.
  socket.on('answer_announcement', function(answer){
    //TODO write th user's name to the name text in the view.

    // write the users answer to the answer text in the view.
    document.getElementById('user_answer').innerHTML = answer.correct;
  });


}

$(document).ready(main);
