// configure all the methods to get all the relevant agricultural information
// configure it all into fields and methods, similar to OOP principles 
var request = require('request');

// map relevant data from other API's to information about loan
var apiInfo= {
	"World Bank" : "Agriculture & Rural Development" 
	 // crop production index, food production index, agriculture value added per worker
};

var kivaCategories = {
	"Agriculture" : {
		"World Bank" : [
			"Agriculture & Rural Development", 
			// variables: crop production index, agriculture value added?\
			"Economy & Growth", // agriculture value added
			"Gender"] // % employments in agriculture for male and female
 	},
	"Women" : {
		"World Bank" : ["Gender"] 
		// Variables: 
		// children in employment, female
		// long term unemployment, female 
		// children in employment, study and work : female 
		// employees, female
	}, 
	"Education" : {
		"World Bank" : ["Education", 
		// children out of school, literacy rate, persistence to last grade of primary
		// primary completion rate
		// progression to secondary school 
		// school enrollment
		// unemployment rate 
		"Gender"] // Literacy rates for youth female and youth males
	},
	"Health" : {
		"World Bank" : ["Agriculture", // improved water source ?
		"Aid Effectiveness", // improved sanitation facilities
		// life expenctancy at birth, malnutrition prevalence, mortality rate
		"Gender", // : Life Expectancy at birth, female and male
		"Infrastructure"] // improved water sources, rural and urban
	},
	"Single Parents" : {
		"World Bank" : ["Aid Effectiveness"] // Maternal mortality rate, teenage mothers
		// pregnant women receiving prenatal care 
	}, 
	"Shelter" : {},
	"Retail Businesses" : {},
	"Food" : {}
};

// url for agriculture definition by world bank
var defURl = "http://api.worldbank.org/topic/1?per_page=100&format=json";



var baseURL = "http://api.worldbank.org/countries/";
var endURL = "/indicators/AG.PRD.CROP.XD?per_page=100&date=2000:2015&format=json";

function findInfo(location, callback) {
	var data;
	var url = baseURL + location + endURL;
	request(url, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var data = JSON.parse(body);
			callback(extractInfo(data));
		}
	});
}

function extractInfo(data) {
	// data = array
	var info = data[1];
	var result = "Data" + "\n";
	info.forEach(function(value, index, array) {
		// value = object
		if (value.value != null) {
			result = result + "Year: " + value.date + ", Index Value: " + value.value + "\n";
		}
	});
	return(result); // string
};

var apiInfo = {
	apiInfo : kivaCategories,
	findInfo : findInfo	
};




module.exports = apiInfo;