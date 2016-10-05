var auth = require('./auth.js');
var express = require('express');
var md5 = require('md5');
var router = express.Router();

/** Index route
 *  With each call of this route a unique ticket and signature are
 *  generated and stored in the database. These so called hashes
 *  are used for authentication in the Session API. For more
 *  information see the docs. */
router.get('/', function(req, res) {

  var db = req.db;
  var hashCollection = db.get('sessions.hashes');

  // Take header field "user-agent" for creating the signature in order to
  // assert that only the agent that gets sent the ticket can actually
  // login to the Session API
  auth.insertHash(hashCollection, req.headers['user-agent'], function(e,hash){

    if (e === null) {

      // respond with the app including the ticket
      res.render('index', {
        title: 'Express',
        apiTicket: hash.ticket
      });
    } else {

      // Respond with error page
      console.error('[ERROR] ' + e.message);
      res.render('error', {
        message: e.message,
        error: {}
      });
    }
  });
});

/** GET JSON representation of all entries in mongo collection
 *  'content' that are flagged as live.
 *  */
router.get('/content', function(req, res){

  var db = req.db;
  var contentCollection = db.get('content');
  contentCollection.find({'isLive': true}, function(e, docs){
    res.json(docs);
  });

});

/** GET JSON representation of all entries in mongo collection
 *  'content', regardless whether they are live or not.
 *  */
router.get('/content/all', function(req, res){

  var db = req.db;
  var contentCollection = db.get('content');
  contentCollection.find({}, function(e, docs){
    res.json(docs);
  });

});

module.exports = router;
