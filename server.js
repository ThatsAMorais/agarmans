var express = require('express'),
    mongodb = require("mongodb"),
    bodyParser = require('body-parser'),
    anagrams = require('./routes/anagrams'),
    words = require('./routes/words');

var app = express();

var ObjectID = mongodb.ObjectID;
app.use(bodyParser.json()); // support json encoded bodies

// Create a database variable outside of the database connection callback to reuse the connection pool
global.db = null;
// Setup the mongodb callback
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Mongo connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// Route configuration below

/**
 * @api {POST} /words
 * @apiName AddWords
 * @apiGroup words
 * 
 * @apiDescription Takes a JSON array of English-language words and adds them to the corpus (data store).
 *
 * @apiSampleRequest /words.json
 * 
 * @apiExample cURL example
 * $ curl -i -X POST -d '{ "words": ["read", "dear", "dare"] }' http://localhost:3000/words.json 
 * 
 * @apiSuccessExample {js} Success-Response:
 *      HTTP/1.1 201 CREATED
 */
app.post('/words.json', words.add);

/**
 * @api {DELETE} /words/:word
 * @apiName DeleteWord
 * @apiGroup words
 * 
 * @apiParam word  the word being deleted
 * 
 * @apiDescription Removes a single word from the corpus
 *
 * @apiSampleRequest /words/read.json
 * 
 * @apiExample cURL example
 * $ curl -i -X DELETE http://localhost:3000/words/read.json
 * 
 * @apiSuccessExample {js} Success-Response:
 *      HTTP/1.1 200 OK
 */
app.delete('/words/:word.json', words.deleteWord);

/**
 * @api {DELETE} /words
 * @apiName DeleteCorpus
 * @apiGroup words
 * 
 * @apiParam word  the word being deleted
 * 
 * @apiDescription Removes a single word from the corpus
 *
 * @apiSampleRequest /words.json
 * 
 * @apiExample cURL example
 * $ curl -i -X DELETE http://localhost:3000/words.json
 * 
 * @apiSuccessExample {js} Success-Response:
 *      HTTP/1.1 204 No Content
 */
app.delete('/words.json', words.deleteCorpus);

/**
 * @api {GET} /anagrams/:word
 * @apiName GetAnagrams
 * @apiGroup anagrams
 * 
 * @apiParam word  the word for which anagrams will be generated
 * @apiParam max  Optional. the maximum number of results to return
 * 
 * @apiDescription Returns a JSON array of English-language words that are anagrams of the word passed in the URL.
 *
 * @apiSampleRequest /anagrams/read.json?max_results
 * 
 * @apiExample cURL example
 * $ curl -i http://localhost:3000/anagrams/read.json
 * 
 * @apiSuccessExample {js} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "anagrams": [ "dear", "dare" ] 
 *      }
 */
app.get('/anagrams/:word.json', anagrams.read);
