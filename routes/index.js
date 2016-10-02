var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var db = req.db;
  var hashCollection = db.get('sessions.hashes');
  var hashToInsert = {
    hash: "woieusdf", // TODO replace with actual hash
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
