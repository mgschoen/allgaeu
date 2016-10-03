var auth = require('./auth.js');
var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  res.send('Authentication failed');
});

module.exports = {
  'auth': auth,
  'router': router
};
