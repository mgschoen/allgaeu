var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  res.send('Authentication failed');
});

module.exports = router;
