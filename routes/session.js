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

    console.log("e: ");
    console.log(e);
    console.log("result: ");
    console.log(result);

    if (e === null) {
      // Is hash unique?
      if (result.length === 1) {

        // Remove used hash from collection
        hashCollection.remove({'hash': submittedHash}, function(err){
          if (err === null) {

            // Positive response
            res.send('Authentication success, hash ' + submittedHash + ' consumed');
          } else {

            // Removing failed
            console.error('[ERROR] Error removing hash ' + submittedHash + ' from hash collection');
            return false;
          }
        });
      } else if (result.length > 1) {

        // Hash not unique
        console.error('[ERROR] Hash ' + submittedHash + ' is not unique!');
        return false;
      } else {

        console.error('[ERROR] Authentication attempt failed: Hash ' + submittedHash + ' was not found.');
        res.send('Hash incorrect, authentication failed');
        return false;
      }
    } else {
      res.send(e.message);
    }
  });
});

module.exports = router;
