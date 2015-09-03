// main website routes

var express = require('express');
var router = express.Router();

// loads homepage
router.get('/', function(req, res) {
	res.sendFile('index.html');
});

module.exports = router;