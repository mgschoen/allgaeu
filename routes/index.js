var express = require('express');
var md5 = require('md5');
var router = express.Router();

/** Index route
 *  With each call of this route a unique hash is generated and
 *  stored in the database. These hashes are used for authentication
 *  in the Session API. */
router.get('/', function(req, res) {
  var db = req.db;
  var hashCollection = db.get('sessions.hashes');
  var hashToInsert = {
    hash: md5((new Date()).valueOf().toString() + Math.random().toString()),
    creationDate: new Date()
  };
  hashCollection.insert(hashToInsert, {}, function(err,result){
    if (err === null) {
      res.render('index', {
        title: 'Express',
        authHash: hashToInsert.hash
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
