// restful api routes

var express = require('express');
var router = express.Router();
var locInfo = require("../countryData"); 
var agInfo = require("../getAgriculture");

// agInfo.apiInfo = kiva categories 
// agInfo.findInfo(location, callback) : finds the appropriate information

router.get('/', function(req, res) {
	// need to configure this to send the index page 
	res.send('Hello World, this is a different page');
});


// needs to send an array of countries
// response sends back json object with country, latitude and longitude values
router.get("/Location", function(req, res) {
	var countries = req.query.countryNames; // object of country names
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

router.get('/:sector', function(req, res) {
	var sector = req.params.sector;
});

// finish the function before returning the response
router.get('/Agriculture', function(req, res) {
	var location = req.query.location;
	agInfo.findInfo(location, function(data) {
		res.send(data); // sends string
	});
});


router.get('/Women', function(req, res) {

});

router.get('/Education', function(req, res) {

});

router.get("/Health", function(req, res) {

});

router.get('/Single+Parents', function(req, res) {

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



/*
var kivaCategories = {
	"Agriculture" : {
		"World Bank" : "Agriculture & Rural Development" 
		// variables: crop production index, agriculture value added?\
		"World Bank" : "Economy & Growth" // agriculture, value added
		"World Bank" : "Gender" // % employments in agriculture for male and female
 	},
	"Women" : {
		"World Bank" : "Gender" // children in employment, female
		// long term unemployment, female 
		// children in employment, study and work : female 
		// employees, female
	}, 
	"Education" : {
		"World Bank" : "Education", 
		// children out of school, literacy rate, persistence to last grade of primary
		// primary completion rate
		// progression to secondary school 
		// school enrollment
		// unemployment rate 
		"World Bank" : "Gender" // Literacy rates for youth female and youth males
	},
	"Health" : {
		"World Bank" : "Agriculture", // improved water source ?
		"World Bank" : "Aid Effectiveness", // improved sanitation facilities
		// life expenctancy at birth, malnutrition prevalence, mortality rate
		"World Bank" : "Gender", // : Life Expectancy at birth, female and male
		"World Bank" : "Infrastructure" // improved water sources, rural and urban
	},
	"Single Parents" : {
		"World Bank" : "Aid Effectiveness" // Maternal mortality rate, teenage mothers
		// pregnant women receiving prenatal care 
	}, 
	"Shelter" : {},
	"Retail Businesses" : {},
	"Food" : {}
};

*/


