//==============================================================================
// router.js
//==============================================================================
var express = require('express');
var Question = require('../models/question');
var redis = require("redis"); //require redis module
var router = express.Router();

//make count object to store the counts
var counts = {};
// create a client to connect to redis
var client = redis.createClient();

counts.right = 0;

//==============================================================================
//Returns a single trivia question:
/* { "question": "Who was the first computer programmer?",
    "answerId": 1 }
*/
router.get('/question', function(req, res) {

  Question.count().exec(function (err, count) {
    // Get a random entry
    var random = Math.floor(Math.random() * count)

    Question.findOne().skip(random).exec(
      function(err, questions){

      if(err) {
        return res.status(500).json({message: err.message});
      }
      //create a new object and fill it with 2/3 of the attributes from DB object
      res.json({
                //JSON format
                //http://www.w3schools.com/js/js_json_intro.asp
                // key        //value
                "question" : questions.question,
                "answerID" :questions._id
              });
    });
  });
});


//==============================================================================
//Creates a new trivia question:
/*{ "question": "Who led software development for NASA's Apollo missions?",
  "answer": "Margaret Hamilton" }
}*/
router.post('/question', function(req, res) {
  var question = req.body;
  Question.create(question, function(err, question){
    if (err) {
      return res.status(500).json({err: err.message});
    }
    res.json({'question' : question, message: 'Question Created'});
  });
});



//==============================================================================
// update an existing question. API calls for POST, we use PUT for convention.
/* Should receive this format. and insert to mongo db as per schema.
    {
      question: "Who led software development for NASA's Apollo lunar mission?",
      answer: "Margaret Hamilton"
    }
    */
//router.put('/questions/:id', function(req, res) {
router.post('/question', function(req, res) {
      /* Should receive this format. and insert to mongo db as per schema.
      {
        question: "Who led software development for NASA's Apollo lunar mission?",
        answer: "Margaret Hamilton"
      }
      */
      // Get data:
      var questionText = req.body.question;
      var answerText = req.body.answer;
      var answerId = null;

      Question.find({}).count(function(err, numberQuestions){
          // set proper question id.
          answerId = numberQuestions + 1;

          console.log(answerId);


          // build question to insert based on schema.
          var newQuestion =
          {
            question: questionText,
            answer: answerText,
          }

          // insert to mongoDB, this is asynchronous. The create method adds version keys.
          Question.create(newQuestion, function(err, data){
            if(err){
              console.log(err)
              res.end();
            }
            else{
              console.log("Inserted New Question");
              res.end();
            }
          });
      });
});



//==============================================================================
// receives an answer.
router.post('/answer', function(req, res)
{
  //get user answer from browser
  var userAnswer = req.body;

  // print user's answer and the id.
  console.log("here is the user answer:");
  console.log(userAnswer);

  // if the user posts incorrect data, just send an empty response.
  if(userAnswer == null){
    res.end();
    return;
  }

  Question.findById(userAnswer.answerID, function(err, question)
  {
    var count = {};
    if (err){
      return res.status(500).json({err: err.message});
    }
    client.get("right", function(err, rightCount){
      //check to make sure there's no error
      if (err!==null){
        console.log("ERROR: " + err);
        //exit the function
        return;
      }
      count.right = parseInt(rightCount, 10) || 0;
    })
    if(userAnswer.answer == question.answer)
    {
      client.incr("right");
      count.right = counts.right + 1;
      return res.json(JSON.stringify({ "correct" : true})); // res.json doesn't convert javascript object to json, it must be stringified.
    } else
    {
      client.incr("wrong");
      count.wrong = counts.wrong + 1;
      return res.json(JSON.stringify({"correct" : false}));
    }
  })

});


//==============================================================================
router.get('/score', function(req, res){
  /* format response like so:
    {
    right: 2,
    wrong: 1
  }
  */

  // get wrong and right from computer, computer knows all.
  // get from redis is asynchronous so send data in callback.
  client.mget("right", "wrong", function(err, scoreData){
      var rightScore = scoreData[0]; // right score
      var wrongScore = scoreData[1]; // wrong score

      // data to return.
      var score = {
        right: rightScore,
        wrong: wrongScore
      }

      // send score data
      res.json(JSON.stringify(score));
  });
});
//==============================================================================

module.exports = router;
//==============================================================================
