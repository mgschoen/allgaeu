var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET JSON representation of 'content' collection in db */
router.get('/content', function(req, res){
  var db = req.db;
  var collection = db.get('content');
  collection.find({}, "-_id", function(e, docs){
    res.json(docs);
  });
});

module.exports = router;
