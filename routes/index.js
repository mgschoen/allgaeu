var auth = require('./auth.js');
var express = require('express');
var md5 = require('md5');
var router = express.Router();

/** Index route
 *  With each call of this route a unique ticket is generated and
 *  stored in the database. These tickets are used for authentication
 *  in the Session API. */
router.get('/', function(req, res) {
  var db = req.db;
  var hashCollection = db.get('sessions.hashes');
  var ticket = md5((new Date()).valueOf().toString() + Math.random().toString());
  var signature = md5(ticket + req.headers['user-agent']);
  var hashToInsert = {
    'ticket': ticket,
    'creationDate': new Date(),
    'signature': signature
  };
  console.log(hashToInsert);
  hashCollection.insert(hashToInsert, {}, function(err){
    if (err === null) {
      res.render('index', {
        title: 'Express',
        apiTicket: hashToInsert.ticket
      });
    } else {
      console.log(err);
      return false;
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
