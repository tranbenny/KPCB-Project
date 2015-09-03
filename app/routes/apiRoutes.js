// api routes

var express = require('express');
var router = express.Router();
var locInfo = require("../countryData"); 
var agInfo = require("../getInfo");

// agInfo.apiInfo = kiva categories 
// agInfo.findInfo(location, callback) : finds the appropriate information


router.get('/', function(req, res) {
	// need to configure this to send the index page 
	res.send('Hello World, this is a different page');
});

// gets Kiva most recent Loans route
router.get('/recentLoans', function(req, res) {
	var recentLoansURL = "http://api.kivaws.org/v1/lending_actions/recent.json";
	agInfo.getRecentLoans(recentLoansURL, function(data) {
		res.send(data);
	});
});


// gets all the latitude/longitude values for countries
router.get("/Location", function(req, res) {
	var countries = req.query.countryNames; // object of country code names
	var allCountries = locInfo.countryData; // array of objects
	var result = {};
	allCountries.forEach(function(value, index, array) {
		if (countries.indexOf(value.country) != -1) {
			result[value.country] = {
				lat : value.latitude,
				lon : value.longitude
			};
		}
	});
	res.send(result);
});


// finds the loans for a specific user route
router.get('/lendor/:username', function(req, res) {
	console.log("finding username");
	var username = req.params.username;
	// fetch loans 
	agInfo.userFind(username, function(data) {
		res.send(data);
	});
});


// finds the relevant World Bank API data for a country/sector 
router.get('/:countryCode/:sector', function(req, res) {
	console.log("finding country and sector information");
	var countryCode = req.params.countryCode;
	var sector = req.params.sector;
	console.log("Country: " + countryCode + " Sector: " + sector);
	if (!(sector in agInfo.apiInfo)) {
		console.log("Could not find cateogry");
		res.send({message : "Sorry data about this sector has not yet been found"});
		return;
	} else {
		console.log("Fetching Data now");
		agInfo.mainFind(countryCode, sector, function(data) {
			res.send(data);
		});
	};
});


module.exports = router;


/*
UN Human Development Reports
Table 2 : Human Development Index Trends = Generalized model taking into account --> 
Life Expectancy, Years in school, and income levels

Table 3: Inequality-adjusted Human Development Index

Trends Available:
-Adult literacy rate
-education index
-expected years of schooling : for males and feamiles, both
-Gender Development Index
-Gender Inequality Index
-Health Index
-Human Development Index
-Inequality-adjusted HDI
-Inequality-adjusted life expectancy index
-Intensity of Deprivation
-Life Expectancy at birth
-Maternal Mortality Ratio
-Mean Years of Schooling
-Population with at least secondary education
-Under Five mortality rate 







*/





