var auth = require('./auth.js');
var express = require('express');
var router = express.Router();

const VALID_ANSWER_VALUES = ['yes','no',null];

router.post('/', function(req, res) {
  res.send('Authentication failed');
});

router.get('/:token', function(req, res){
  var db = req.db;
  var tokensCollection = db.get('sessions.tokens');
  auth.isValidAccessToken(tokensCollection, req.params.token, function(e, valid){
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
router.get('/:token/start', function(req,res){

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
  auth.isValidAccessToken(tokensCollection, req.params.token, function(e, valid){

    // Token valid
    if (e === null && valid) {

      try {
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
      } catch (g) {
        console.error('[ERROR] Error starting session: ' + g.message);
        res.json({
          'success': false,
          'message': 'Error starting session: ' + f.message
        });
        return false;
      }

    // Authentication errors
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

/** Retrieve session object by GET-ing /session/:token/get/:id
 *  This route responds with the database entry of the session with
 *  the specified ID. If no such session exists, it responds with an
 *  error object.
 */
router.get('/:token/get/:id', function(req,res){

  var db = req.db;
  var sessionsCollection = db.get('sessions');
  var tokensCollection = db.get('sessions.tokens');
  var idToGet = req.params.id;

  // Validate access token
  auth.isValidAccessToken(tokensCollection, req.params.token, function(e, valid){

    // Token valid?
    if (e === null && valid) {

      try {
        // Search for provided ID in sessions collection
        sessionsCollection.find({
          '_id': idToGet
        }, function(f, result){

          if (f === null) {

            var numResults = result.length;

            if (numResults === 1) {

              // Session found
              // Respond with JSON object of session
              res.json({
                'message': '',
                'session': result[0],
                'success': true
              });
              return true;

            } else if (numResults > 1) {

              // Session not unique
              console.error('[ERROR] Session duplicate found: Found ' + numResults + ' sessions with ID ' + idToGet);
              res.json({
                'success': false,
                'message': 'Internal server error. Please try again.'
              });
              return false;
            } else {

              // Session not found
              res.json({
                'success': false,
                'message': 'Session with ID ' + idToGet + ' does not exist.'
              });
              return true;
            }
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
      } catch (g) {
        // Error searching collection
        console.error('[ERROR] ' + g.message);
        res.json({
          'success': false,
          'message': g.message
        });
        return false;
      }

    // Authentication errors
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

/** In a specified session, update the value of an existing answer or
 *  set a new answer value by POST-ing to
 *
 *    /session/:token/set/:sid/answer/:aid/val/:value
 *
 *  where
 *
 *    :token is the access token,
 *    :sid is the ID of the session to change,
 *    :aid is the ID of the answer to change and
 *    :value is the new value the answer should get assigned.
 *
 *  In case of success, this route responds with the updated session
 *  object. Otherwise it responds with an error object.
 */
router.post('/:token/set/:sid/answer/:aid/val/:value', function(req,res){

  var db = req.db;
  var sessionsCollection = db.get('sessions');
  var tokensCollection = db.get('sessions.tokens');
  var submittedSessionID = req.params.sid;
  var submittedAnswerID = req.params.aid;
  var submittedAnswerVal = req.params.value;

  // Validate access token
  auth.isValidAccessToken(tokensCollection, req.params.token, function(e, valid){

    // Token valid?
    if (e === null && valid) {

      // Submitted answer ID valid?
      var regexMongoID =/^([a-f]|[0-9]){24}$/;
      if (regexMongoID.test(submittedAnswerID)) {

        // Submitted answer value valid?
        if (VALID_ANSWER_VALUES.indexOf(submittedAnswerVal) > -1) {

          try {

            // Search for session
            sessionsCollection.findOne(
              { '_id': submittedSessionID },
              function (f, sessionFound) {

                if (f === null && sessionFound !== null) {

                  // Is session still open?
                  if (sessionFound.status !== 'closed') {

                    var updateQuery = {};
                    updateQuery['answers.' + submittedAnswerID] = submittedAnswerVal;

                    // Update session
                    sessionsCollection.findOneAndUpdate(
                      {'_id': submittedSessionID},
                      {$set: updateQuery},
                      function (g, updatedSession) {

                        if (g === null) {

                          res.json({
                            'message': '',
                            'session': updatedSession,
                            'success': true
                          });
                          return true;

                        } else {

                          console.log('[ERROR] Error while setting answer value: ' + e.message);
                          res.json({
                            'success': false,
                            'message': 'Error while setting answer value: ' + e.message
                          });
                          return false;
                        }
                      }
                    );
                  } else {

                    // Session already closed
                    console.error('[ERROR] Session with ID ' + submittedSessionID + ' is already closed. Edit request rejected.');
                    res.json({
                      'success': false,
                      'message': 'Session with ID ' + submittedSessionID + ' is already closed and can not be edited'
                    });
                    return false;
                  }
                } else if (f === null) {

                  // No session found
                  console.error('[ERROR] Session with ID ' + submittedSessionID + ' was not found.');
                  res.json({
                    'success': false,
                    'message': 'Session with ID ' + submittedSessionID + ' was not found'
                  });
                  return false;
                } else {

                  // Error searching for session
                  console.error('[ERROR] Error searching collection: ' + f.message);
                  res.json({
                    'success': false,
                    'message': 'Internal server error. Please try again.'
                  });
                  return false;
                }
              }
              );

          } catch (g) {

            // Exception while accessing database
            console.error('[ERROR] ' + g.message);
            res.json({
              'success': false,
              'message': g.message
            });
            return false;
          }
        } else {

          // Submitted answer value invalid
          console.log('[ERROR] Submitted answer value ' + submittedAnswerVal + ' is invalid');
          res.json({
            'success': false,
            'message': 'Submitted answer value ' + submittedAnswerVal + ' is invalid'
          });
          return false;
        }
      } else {

        // Submitted answer ID invalid
        console.log('[ERROR] Submitted answer ID ' + submittedAnswerID + ' is invalid');
        res.json({
          'success': false,
          'message': 'Submitted answer value ' + submittedAnswerID + ' is invalid'
        });
        return false;
      }

    // Authentication errors
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

/** Close an existing session by POST-ing to /session/:token/set/:id/close
 *  This route changes the status of a session to 'closed'
 *  and saves the current time as time of termination. A
 *  closed session cannot be changed any further. However,
 *  it can still be read by GET-ing the /session/:token/get/:id
 *  route.
 */
router.post('/:token/set/:id/close', function(req,res){

  var db = req.db;
  var sessionsCollection = db.get('sessions');
  var tokensCollection = db.get('sessions.tokens');
  var submittedSessionID = req.params.id;

  // Validate access token
  auth.isValidAccessToken(tokensCollection, req.params.token, function(e, valid){

    // Token valid?
    if (e === null && valid) {

      try {

        // Search for session
        sessionsCollection.findOne(
          { '_id': submittedSessionID },
          function (f, sessionFound) {

            if (f === null && sessionFound !== null) {

              // Is session still open?
              if (sessionFound.status !== 'closed') {

                // DB query: set status to closed and current
                // time as time of session termination
                var updateQuery = {
                  'closed': new Date(),
                  'status': 'closed'
                };

                // Update session
                sessionsCollection.findOneAndUpdate(
                  {'_id': submittedSessionID},
                  {$set: updateQuery},
                  function (g, updatedSession) {

                    if (g === null) {

                      res.json({
                        'message': '',
                        'session': updatedSession,
                        'success': true
                      });
                      return true;

                    } else {

                      console.log('[ERROR] Error closing session: ' + e.message);
                      res.json({
                        'success': false,
                        'message': 'Error closing session: ' + e.message
                      });
                      return false;
                    }
                  }
                );

              } else {

                // Session already closed
                console.error('[ERROR] Session with ID ' + submittedSessionID + ' is already closed. Close request rejected.');
                res.json({
                  'success': false,
                  'message': 'Session with ID ' + submittedSessionID + ' is already closed'
                });
                return false;
              }

            } else if (f === null) {

              // No session found
              console.error('[ERROR] Session with ID ' + submittedSessionID + ' was not found.');
              res.json({
                'success': false,
                'message': 'Session with ID ' + submittedSessionID + ' was not found'
              });
              return false;
            } else {

              // Error searching for session
              console.error('[ERROR] Error searching collection: ' + f.message);
              res.json({
                'success': false,
                'message': 'Internal server error. Please try again.'
              });
              return false;
            }
          }
        );

      } catch (g) {

        // Exception while accessing database
        console.error('[ERROR] ' + g.message);
        res.json({
          'success': false,
          'message': g.message
        });
        return false;
      }

    // Authentication errors
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
