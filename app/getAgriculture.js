// configure all the methods to get all the relevant agricultural information
// configure it all into fields and methods, similar to OOP principles 
var request = require('request');
var countryData = require('./countryData');

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
	// "Shelter" : {},
	// "Retail Businesses" : {},
	// "Food" : {}
};

// url for agriculture definition by world bank
var defURl = "http://api.worldbank.org/topic/1?per_page=100&format=json";


var baseURL = "http://api.worldbank.org/countries/";

var worldBankEndURLS = {
	// Agriculture :
	"Agriculture" : { 
		cropProductionIndex : "/indicators/AG.PRD.CROP.XD?per_page=100&date=2000:2015&format=json",
		sharedAgriculturalEmployment: "/indicators/ccx_agr_pop_tot?per_page=50&date=1990:2015&format=json"
	},
	"Women" : {
	// Women : 
		genderEquality : "/indicators/5.51.01.07.gender?per_page=50&date=1990:2015&format=json",
		averageYearsSchooling : "/indicators/BAR.SCHL.15UP.FE?per_page=50&date=1990:2015&format=json",
		percentWomen15AboveWithPrimary : "/indicators/BAR.PRM.ICMP.15UP.FE.ZS?per_page=50&date=1990:2015&format=json",
		sharedEmployeedWomen : "/indicators/ccx_emps_pop_fem?per_page=50&date=1990:2015&format=json"
	},
	"Education" : {
	// Education: 
		youthLiteracyRate : "/indicators/1.1_YOUTH.LITERACY.RATE?per_page=50&date=1990:2015&format=json",
		primaryCompletion : "/indicators/5.51.01.08.primcomp?per_page=50&date=1990:2015&format=json",
		hoiSchoolEnrollment : "/indicators/2.0.hoi.Sch?per_page=50&date=1990:2015&format=json"
	},
	"Health" : {
	// Health:
		healthSurvey : "/indicators/5.13.01.01.hlthsurv?per_page=50&date=1990:2015&format=json",
		nationalImmunizationCoverage : "/indicators/5.13.01.01.who?per_page=50&date=1990:2015&format=json"
	},
	"Single Parents" : {
	// Single Parents/Health:
		childrenMalnutrition : "/indicators/5.51.01.02.malnut?per_page=50&date=1990:2015&format=json",
		childMortality : "/indicators/5.51.01.03.mortal?per_page=50&date=1990:2015&format=json",
		maternalHealth : "/indicators/5.51.01.06.matern?per_page=50&date=1990:2015&format=json"
	}
};

var EXendURL = "/indicators/AG.PRD.CROP.XD?per_page=100&date=2000:2015&format=json";

function findInfo(location, callback) {
	var url = baseURL + location + EXendURL;
	request(url, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var data = body;
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


function mainFind(location, sector, callback) {
	var endURLs = worldBankEndURLS[sector]; // object with various keys and end urls
	for (var key in endURLs) {
		// query builder
		// need to perform the api request to send back the data
		var url = baseURL + location + endURLs[key];
		console.log(url);
		request(url, function(err, res, body) {
			if (!err && res.statusCode == 200) {
				var data = { "result" : JSON.parse(body) };
				callback(data);
			}
		});
		return; 
	}
};





var apiInfo = {
	apiInfo : kivaCategories,
	findInfo : findInfo,
	mainFind : mainFind
};







module.exports = apiInfo;




