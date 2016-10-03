var express = require('express');
var md5 = require('md5');
var router = express.Router();

// POST: No signature provided
router.post('/', function(req, res) {
  res.send('Authentication failed');
});

/** Authentication route for Session API.
 *  If the client submits a correct signature to this route,
 *  an access token is generated, stored and returned to the
 *  client.
 *  For more information on the authentication process see
 *  the documentation.
 */
router.post('/:sig', function(req, res) {

  var db = req.db;
  var hashCollection = db.get('sessions.hashes');
  var submittedSignature = req.params.sig;

  // Search for submitted signature
  hashCollection.find({
    'signature': submittedSignature
  }, function(e,result){

    if (e === null) {

      // Is signature unique?
      if (result.length === 1) {

        var ticket = result[0].ticket;

        // Determine time passed since ticket creation
        var ticketCreationDate = result[0].creationDate.valueOf();
        var now = new Date().valueOf();
        if ((now - ticketCreationDate) < 60000) {

          // Remove used ticket and signature from collection
          hashCollection.remove({'signature': submittedSignature}, function (err) {
            if (err === null) {

              var tokenCollection = db.get('sessions.tokens');
              var accessToken = md5((new Date()).valueOf().toString() + Math.random().toString());
              tokenCollection.insert({
                'accessToken': accessToken,
                'creationDate': new Date(),
                'signature': submittedSignature
              }, {}, function (err) {

                if (err === null) {

                  // Respond with access token
                  res.json({
                    'success': true,
                    'accessToken': accessToken,
                    'message': 'Authentication success, ticket ' + ticket + ' consumed'
                  });
                  return true;

                } else {

                  // Storing Token failed
                  console.error('[ERROR] Error storing access token');
                  res.json(jsonError('Internal server error. Please try again'));
                  return false;
                }
              });
            } else {

              // Removing failed
              console.error('[ERROR] Error removing ticket ' + ticket + ' from hash collection');
              res.json(jsonError('Internal server error. Please try again'));
              return false;
            }
          });

        } else {

          // Ticket timed out
          console.error('[ERROR] Ticket ' + ticket + ' has already timed out. Incoming connection refused.');
          hashCollection.remove({'signature': submittedSignature}, function (err) {
            if (err !== null) {
              console.error('[ERROR] Failed to remove ticket from hash collection');
            }
          });
          res.json(jsonError('Ticket timed out, authentication failed'));
          return false;
        }
      }
      else if (result.length > 1) {

        // Signature not unique
        console.error('[ERROR] Signature ' + submittedSignature + ' is not unique!');
        res.json(jsonError('Internal server error. Please try again'));
        return false;
      } else {

        // Signature not found
        console.error('[ERROR] Authentication attempt failed: Signature ' + submittedSignature + ' was not found.');
        res.json(jsonError('Signature incorrect, authentication failed'));
        return false;
      }
    } else {

      // Other error
      console.error('[ERROR] ' + e.message);
      res.json(jsonError('Internal server error. Please try again'));
    }
  });
});

/** Creates a new hash consisting of ticket, signature and timestamp
 *  and insert it to the database. This method is exported.
 * @param hashCollection - monk collection object
 * @param individualString - string that together with the ticket gets hashed to the signature
 * @param callback - function to execute when insertion was performed
 */
var insertHash = function (hashCollection, individualString, callback) {
  var ticket = md5((new Date()).valueOf().toString() + Math.random().toString());
  var signature = md5(ticket + individualString);
  var hash = {
    'creationDate': new Date(),
    'signature': signature,
    'ticket': ticket
  };
  hashCollection.insert(hash, function (err) {
    if (err === null) {
      callback(null, hash);
    } else {
      var error = {
        'msg': 'Failed to write to database',
      };
      callback(error, hash);
    }
  });
};

// Shorthand for generating a json error object
var jsonError  = function (message) {
  var error = {
    'success': false,
    'message': message
  };
  return error;
};

module.exports = {
  'router': router,
  'insertHash': insertHash
};
