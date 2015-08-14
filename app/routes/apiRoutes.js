// restful api routes

var express = require('express');
var router = express.Router();
var agInfo = require("../getAgriculture");

router.get('/', function(req, res) {
	// need to configure this to send the index page 
	res.send('Hello World, this is a different page');
});

// finish the function before returning the response
router.get('/Agriculture', function(req, res) {
	var location = req.query.location;
	agInfo.findInfo(location, function(data) {
		res.send(data); // sends string
	});
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


