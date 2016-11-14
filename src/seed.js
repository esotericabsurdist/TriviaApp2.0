'use strict';

var Question = require('./models/question.js');

var questions = [
  {'question' : 'Who created Linux?', 'answer' : 'Linus Torvalds'},
  {'question' : 'Who is the next president?', 'answer' : 'Donald Trump'},
  {'question' : 'What is the right choice?', 'answer' : 'Nothing'},
  {'question' : 'Who invented the C programming language?', 'answer': 'Dennis Ritchie'},
  {'question' : 'Who founded the GNU project?', 'answer': 'Richard Stallman'},
  {'question' : 'Who founded git?', 'answer': 'Linus Torvalds'}
];

questions.forEach(function(question, index) {
  Question.find({'question' : question.question}, function(err, questions) {
    if (!err && !questions.length) {
      Question.create({"question": question.question, "answer": question.answer});
    }
  });
});
