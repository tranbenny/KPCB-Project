// restful api routes

var express = require('express');
var router = express.Router();
var agInfo = require("../getAgriculture");

router.get('/', function(req, res) {
	res.send('Hello World, this is a different page');
});

// finish the function before returning the response
router.get('/agriculture', function(req, res) {
	agInfo.findInfo(function(data) {
		res.send(data);
	});
});

module.exports = router;


var kivaCategories = {
	"Agriculture" : {},
	"Women" : {}, 
	"Education" : {},
	"Health" : {},
	"Single Parents" : {}, 
	"Shelter" : {},
	"Retail Businesses" : {},
	"Food" : {}
};




