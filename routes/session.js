var auth = require('./auth.js');
var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  res.send('Authentication failed');
});

router.get('/:at', function(req, res){
  var db = req.db;
  var tokensCollection = db.get('sessions.tokens');
  auth.isValidAccessToken(tokensCollection, req.params.at, function(e, valid){
    if (e === null && valid) {
      res.json({
        'success': true,
        'message': 'Congrats! Your access token is totally valid'
      });
    } else if (e === null) {
      res.json({
        'success': false,
        'message': 'There has been an error processing your request'
      });
    } else {
      res.json({
        'success': false,
        'message': e.message
      });
    }
  });
});

/** Start a new session by GET-ing /session/:at/start
 *  This route creates a new user session on the server side,
 *  saves it to the database and responds with a JSON-object
 *  containing info about the session.
 */
router.get('/:at/start', function(req,res){

  var db = req.db;
  var contentCollection = db.get('content');
  var sessionCollection = db.get('sessions');
  var tokensCollection = db.get('sessions.tokens');
  var sessionToInsert = {
    'answers': {},
    'closed': null,
    'started': new Date(),
    'status': 'in-progress'
  };

  // Validate access token
  auth.isValidAccessToken(tokensCollection, req.params.at, function(e, valid){

    // Token valid
    if (e === null && valid) {

      // Determine all currently available content documents (e.g. quiz questions)
      contentCollection.find({}, function(f,docs){

        if (f === null) {

          // Add each document's id to the answers object of the new session
          for (var i = 0; i < docs.length; i++) {
            var id = docs[i]._id;
            sessionToInsert.answers[id] = null;
          }

          // Store the new session in mongo collection sessions
          sessionCollection.insert(sessionToInsert, function(g, result){

            if (g === null) {

              // Respond with info about the generated session
              res.json({
                'message': '',
                'session': sessionToInsert,
                'success': true
              });
              return true;
            } else {

              // Error inserting session to collection
              console.error('[ERROR] ' + g.message);
              res.json({
                'success': false,
                'message': g.message
              });
              return false;
            }
          });
        } else {

          // Error searching collection
          console.error('[ERROR] ' + f.message);
          res.json({
            'success': false,
            'message': f.message
          });
          return false;
        }
      });

    // Validation errors
    } else if (e === null) {
      res.json({
        'success': false,
        'message': 'There has been an error processing your request'
      });
    } else {
      res.json({
        'success': false,
        'message': e.message
      });
    }
  });
});

module.exports = {
  'auth': auth,
  'router': router
};
