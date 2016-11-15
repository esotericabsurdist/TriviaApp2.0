//==============================================================================
// index.js
//==============================================================================
var main = function() {

  // setup connection on page loaded.
  var socket = io.connect('http://localhost:4200');

  //============================================================================
  //
  //            ********** Onclick Listeners ***********
  //
  //============================================================================
  // join user to trivia game upon join button click.
  document.getElementById('submit_user_name_button').onclick = function() {
    // get username.
    var user_name = document.getElementById('user_name').value;

    // if the user name is in the field, join them.
    if( !(user_name == "" || user_name == null) ){
      // add to window.
      window.USER_NAME = user_name;

      // Send the user the server.
      socket.emit('join_user', {name: user_name});
    }
  }

  //============================================================================
  // submit trivia answer on submit button click.
  document.getElementById('submit_trivia_answer_button').onclick = function(){
    // get user's answer from input field.
    var answer_text = document.getElementById('user_answer_text').value;

    // build object to send to the api.
    var answer_data = {
      "answerID": window.ANSWER_ID,
      "answer": answer_text
    }

    // send a POST request to our api to check if the user's answer is correct.
    $.ajax({
      url: '/answer',
      type: 'POST',
      data: JSON.stringify(answer_data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(answer_correctness){
          // build an object to store the user's name and the corrrectness of their answer.
          // posts to /answer returns answer_response in this format: { "correct" : true}
          var user_answer = {
            "user_name": window.USER_NAME,
            "correct": JSON.parse(answer_correctness).correct
          }

          // emit the user's name and the correctness of their answer to the server.
          socket.emit('answer', JSON.stringify(user_answer));
        }
    });
  }
  //============================================================================
  document.getElementById('get_question').onclick = function(){
    // make an ajax GET to our API for a random question.
    update_question();
  }



  //============================================================================
  //
  //            ********** Helper Functions ***********
  //
  //============================================================================
  var update_score = function() {

    $.ajax({
      url: '/score',
      type: 'GET',
      dataType: "json",
      success: function(score){

          if(score != null){
            // tell the server the current score.
            socket.emit('score', score);
          }
          else{
            // just print something.
            document.getElementById('question').innerHTML = "null response, something went wrong.";
          }
      }
    });
  }
  //============================================================================
  var update_question = function (){
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
            // just print something.
            document.getElementById('question').innerHTML = "null response, something went wrong.";
          }
      }
    });
  }
  //============================================================================






  //============================================================================
  //
  //                ********** Socket Listeners **********
  //
  //============================================================================

  // when the server emits a new user update, update the online user list.
  socket.on('new_user_announcement', function(user){
    // add the username to the users list
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(user.name));
    document.getElementById('online_users').appendChild(li);
  });
  //============================================================================


  // when the server emits a trivia_announcement, post the trivia questions in the view.
  socket.on('trivia_announcement', function(trivia){
    if(trivia != null){

      // update the html with our trivia.
      document.getElementById('trivia_question').innerHTML = trivia.question;

      // save the id.
      window.ANSWER_ID = trivia.answerID;
    }
    else{
      // just print something.
      document.getElementById('trivia_question').innerHTML = "null response, something went wrong.";
    }
  });

  //============================================================================
  // when the server emits the correctness of answer and the user who posted it, update the view.
  socket.on('answer_announcement', function(answer_data){
    if(answer_data != null){
      console.log(answer_data);
      var answer = JSON.parse(answer_data);
      // write the users answer to the answer text in the view.
      document.getElementById('user_who_submitted_answer').innerHTML = 'Submitted by: ' + answer.user_name;
      document.getElementById('user_answer_correctness').innerHTML = 'Answer is correct:' + answer.correct;

      // now that the answer has been updated, send update the score request to sever to update all the client's views with score.
      update_score();
    }
    else {
      document.getElementById('user_answer_correctness').innerHTML = "user submitted answer, null response from server";
    }
  });
  //============================================================================

  // when the server emits the new score data, update the view.
  socket.on('score_announcement', function(score_data){
    if(score_data != null){
      // convert the JSON to a usable JS object.
      var score = JSON.parse(score_data);

      // set the scores into the view.
      document.getElementById('right_score').innerHTML = 'Right Answers: ' + score.right;
      document.getElementById('wrong_score').innerHTML = 'Wrong Answers: ' + score.wrong;

    }
  });
  //============================================================================
} // end of main.
//==============================================================================
$(document).ready(main);
//==============================================================================
