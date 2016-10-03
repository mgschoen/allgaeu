var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  res.send('Authentication failed');
});

router.post('/:hash', function(req, res) {

  var db = req.db;
  var hashCollection = db.get('sessions.hashes');
  var submittedHash = req.params.hash;

  // Search for submitted hash
  hashCollection.find({
    'hash': submittedHash
  }, function(e,result){

    if (e === null) {

      // Is hash unique?
      if (result.length === 1) {

        // Determine time passed since hash creation
        var hashCreationDate = result[0].creationDate.valueOf();
        var now = new Date().valueOf();
        if ((now - hashCreationDate) < 60000) {

          // Remove used hash from collection
          hashCollection.remove({'hash': submittedHash}, function (err) {
            if (err === null) {

              // Positive response
              res.send('Authentication success, hash ' + submittedHash + ' consumed');
              return true;
            } else {

              // Removing failed
              console.error('[ERROR] Error removing hash ' + submittedHash + ' from hash collection');
              return false;
            }
          });

        } else {

          // Hash timed out
          console.error('[ERROR] Hash ' + submittedHash + ' has already timed out. Incoming connection refused.');
          res.send('Connection timed out, authentication failed');
          return false;
        }
      }
       else if (result.length > 1) {

        // Hash not unique
        console.error('[ERROR] Hash ' + submittedHash + ' is not unique!');
        return false;
      } else {

        // Hash not found
        console.error('[ERROR] Authentication attempt failed: Hash ' + submittedHash + ' was not found.');
        res.send('Hash incorrect, authentication failed');
        return false;
      }
    } else {

      // Other error
      console.error('[ERROR] ' + e.message);
      res.send(e.message);
    }
  });
});

module.exports = router;
