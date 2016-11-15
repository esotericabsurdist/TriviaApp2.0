# TriviaApp2.0

##Description
This project is an exercise in ajax and socket io.  It is a simple multiplayer trivia game that uses ajax to retreive trivia
data from an API we built locally, and and sockets to update the client's views. 

##Requirements
1. Node.js
2. express
3. redis server
4. mongodb 

##How to run application
1. Clone or Download the project.
2. Navigate to the projects directory.
3. Run the following commands:
  'npm install'
  'npm redis-server &'
  'npm mongod --dbpath YOUR_PATH_TO_DATA_FOLDER &'
  'npm start'
 
If redis and mongo servers are running, the application should be running on port 3000. eg. (localhost:3000)

##Notes
There is a 'seed.js' file configured to run at start-up. This script populates some trivia data into the mongodb database. 
