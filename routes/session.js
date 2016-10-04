var auth = require('./auth.js');
var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  res.send('Authentication failed');
});

router.get('/:at', function(req, res){
  var db = req.db;
  var tokensCollection = db.get('sessions.tokens');
  auth.isValidAccessToken(tokensCollection, req.params.at, function(err, valid){
    if (err === null && valid) {
      res.json({
        'success': true,
        'message': 'Congrats! Your access token is totally valid'
      });
    } else if (err === null) {
      res.json({
        'success': false,
        'message': 'There has been an error processing your request'
      });
    } else {
      res.json({
        'success': false,
        'message': err.message
      });
    }
  });
});

module.exports = {
  'auth': auth,
  'router': router
};
