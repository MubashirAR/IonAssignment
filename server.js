var express = require('express');
var app = express();
const fs = require('fs');
var mongoose = require("mongoose");
var JSONStream = require('JSONStream');
var es = require('event-stream')
mongoose.Promise = global.Promise;
const connection = mongoose.connect("mongodb://localhost:27017/ION");
var conn = mongoose.connection;
app.use(express.static('public'));
app.use(express.static('node_modules'));
const streamToMongoDB = require("stream-to-mongo-db").streamToMongoDB;
var Schema = mongoose.Schema;

var mySchema = new Schema({
  January : Number,
  February : Number,
  March : Number,
  April : Number,
  May : Number,
  June : Number,
  July : Number,
  August : Number,
  September : Number,
  October : Number,
  November : Number,
  December : Number
});
const MyModel    = mongoose.model('data', mySchema);



   
   var request = require('request');
   	// Get the data from the API. Ideally we would want to use writestream on the other side. 
      // In this case I have simply uploaded a dummy JSON online and fetched it using the url below
	app.get('/chartData', function(req, res){ 
      var id;
   	request('https://api.myjson.com/bins/komgt', function (error, response, body) {
   	      console.log('error:', error); // Print the error if one occurred and handle it
   	      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            var obj = new MyModel(JSON.parse(body));
            obj.save(function(err,room) {
               console.log(room.id);
               id=room.id;
            });
            
   	      res.send(body)
   	    });

	})

   //Once the latest Bitcoin value is saved, we will fetch it from the database
   app.get('/getData', function(req, res) {
      res.writeHead(200,{'Content-Type':'application/json'});
      // I am streaming the data (fetching one document at a time)
      // I have piped the data from the DB into the writestream of the response
      // This allows sending large data without having to store all of it in the RAM
      MyModel.find().cursor().pipe(JSONStream.stringify()).pipe(res);
   })

   
app.listen(3000);