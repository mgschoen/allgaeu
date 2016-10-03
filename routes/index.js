var auth = require('./auth.js');
var express = require('express');
var md5 = require('md5');
var router = express.Router();

/** Index route
 *  With each call of this route a unique hash is generated and
 *  stored in the database. These hases are used for authentication
 *  in the Session API. For more information see the docs. */
router.get('/', function(req, res) {

  var db = req.db;
  var hashCollection = db.get('sessions.hashes');

  // Take header field "user-agent" for creating the signature in order to
  // assert that only the agent that gets sent the ticket can actually
  // login to the Session API
  auth.insertHash(hashCollection, req.headers['user-agent'], function(err,hash){

    if (err === null) {

      // respond with the app including the ticket
      res.render('index', {
        title: 'Express',
        apiTicket: hash.ticket
      });
    } else {

      // Respond with error page
      console.error('[ERROR] ' + err.message);
      res.render('error', {
        message: err.message,
        error: {}
      });
    }
  });
});

/* GET JSON representation of 'content' collection in db */
router.get('/content', function(req, res){
  var db = req.db;
  var contentCollection = db.get('content');
  contentCollection.find({}, "-_id", function(e, docs){
    res.json(docs);
  });
});

module.exports = router;
