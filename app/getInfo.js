// sectors to add:
// Education, Services, Food, Manufacturing, Clothing, Transportation, Arts
// Retail, Construction 

// need to add housing


// configure all the methods to get all the relevant agricultural information
// configure it all into fields and methods, similar to OOP principles 
var request = require('request');
var countryData = require('./countryData');
// var results = { "result" : [] };

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
	"Services" : {},
	"Food" : {},
	"Manufacturing" : {},
	"Clothing" : {},
	"Retail" : {},
	"Construction" : {},
	"Transportation" : {}

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
		sharedAgriculturalEmployment: "/indicators/ccx_agr_pop_tot?per_page=50&date=1990:2015&format=json",
		percentAgriculturalLand : "/indicators/AG.LND.AGRI.ZS?per_page=50&date=2000:2015&format=json",
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
		hoiSchoolEnrollment : "/indicators/2.0.hoi.Sch?per_page=50&date=1990:2015&format=json",
		shareOfInactiveStudents : "/indicators/ccx_inact_pop_tot?per_page=50&date=2000:2015&format=json",
	},
	"Health" : {
	// Health:
		healthSurvey : "/indicators/5.13.01.01.hlthsurv?per_page=50&date=1990:2015&format=json",
		nationalImmunizationCoverage : "/indicators/5.13.01.01.who?per_page=50&date=1990:2015&format=json", 
		childrenMalnutrition : "/indicators/5.51.01.02.malnut?per_page=50&date=1990:2015&format=json",
		immunization : "/indicators/5.51.01.04.immun?per_page=50&date=2000:2015&format=json"
	},
	"Single Parents" : {
	// Single Parents/Health:
		childrenMalnutrition : "/indicators/5.51.01.02.malnut?per_page=50&date=1990:2015&format=json",
		childMortality : "/indicators/5.51.01.03.mortal?per_page=50&date=1990:2015&format=json",
		maternalHealth : "/indicators/5.51.01.06.matern?per_page=50&date=1990:2015&format=json"
	}, 
	"Services" : {
		serviceImports : "/indicators/BM.GSR.NFSV.CD?per_page=50&date=2000:2015&format=json",
		serviceExports : "/indicators/BX.GSR.NFSV.CD?per_page=50&date=2000:2015&format=json",
		shareEmployed : "/indicators/ccx_empl_pop_tot?per_page=50&date=2000:2015&format=json",
		laborForce : "/indicators/ccx_lf_pop_tot?per_page=50&date=2000:2015&format=json",
		serviceEmployed : "/indicators/ccx_serv_pop_tot?per_page=50&date=2000:2015&format=json",
		unemploymentRate : "/indicators/ccx_unempr_pop_tot?per_page=50&date=2000:2015&format=json"
	}, 
	"Food" : {
		foodProductionIndex : "/indicators/AG.PRD.FOOD.XD?per_page=50&date=2000:2015&format=json",
	}, 
	"Manufacturing" : {
		shareEmployed : "/indicators/ccx_empl_pop_tot?per_page=50&date=2000:2015&format=json",
		laborForce : "/indicators/ccx_lf_pop_tot?per_page=50&date=2000:2015&format=json",
		shareUnemployed : "/indicators/ccx_unempl_pop_tot?per_page=50&date=2000:2015&format=json",
		unemploymentRate  : "/indicators/ccx_unempr_pop_tot?per_page=50&date=2000:2015&format=json"
	}, 
	"Clothing" : {
		shareEmployed : "/indicators/ccx_empl_pop_tot?per_page=50&date=2000:2015&format=json",
		shareUnemployed : "/indicators/ccx_unempl_pop_tot?per_page=50&date=2000:2015&format=json"
	}, 
	"Retail" : {
		shareEmployed : "/indicators/ccx_empl_pop_tot?per_page=50&date=2000:2015&format=json",
		shareUnemployed : "/indicators/ccx_unempl_pop_tot?per_page=50&date=2000:2015&format=json",
		unemploymentRate : "/indicators/ccx_unempr_pop_tot?per_page=50&date=2000:2015&format=json"
	}, 
	"Construction" : {
		shareEmployed : "/indicators/ccx_empl_pop_tot?per_page=50&date=2000:2015&format=json",
		laborForce : "/indicators/ccx_lf_pop_tot?per_page=50&date=2000:2015&format=json",
		shareUnemployed : "/indicators/ccx_unempl_pop_tot?per_page=50&date=2000:2015&format=json",
		unemploymentRate : "/indicators/ccx_unempr_pop_tot?per_page=50&date=2000:2015&format=json"
	}, 
	"Transportation" : {
		transportServices : "/indicators/BM.GSR.TRAN.ZS?per_page=50&date=2000:2015&format=json",
		laborForce : "/indicators/ccx_lf_pop_tot?per_page=50&date=2000:2015&format=json", 
		unemploymentRate : "/indicators/ccx_unempr_pop_tot?per_page=50&date=2000:2015&format=json"
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

// figure out a way to send back the data response after multiple requests 
function mainFind(location, sector, callback) {
	var endURLs = worldBankEndURLS[sector]; // object with various keys and end urls
	var sum = Object.keys(endURLs).length;
	var results = {"result" : []};
	// for loop needs to contain a method for http requests
	for (var key in endURLs) {
		// query builder
		// need to perform the api request to send back the data
		var url = baseURL + location + endURLs[key];
		//console.log(url);
		httpRequests(url, sum, results, callback);
	}
};

function httpRequests(url, sum, results, callback) {
	request(url, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var data = JSON.parse(body);
			//console.log("Data: " + data);
			results["result"].push(data);
		}
		if (results["result"].length == sum) {
			// console.log("Sending the reponse back now!");
			callback(results);
		} 
	});
}


function userFind(username, callback) {
	var url = "http://api.kivaws.org/v1/lenders/" + username + "/loans.json";
	request(url, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var data = JSON.parse(body);
			console.log("User data: " + data);
			var result = { "result" : data };
			callback(result);
		} else {
			var result = { "result" : "User not found" };
			callback(result);
		}
	});
};

function getRecentLoans(url, callback) {
	request(url, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var data = JSON.parse(body);
			var result = { "result" : data };
			callback(result);
		} else {
			var result = {"result" : "Error retrieving data"};
			callback(result);
		}
	});
}

// the requests are getting the data, but it is not sending the response back. The methods are ending too quickly


var apiInfo = {
	apiInfo : kivaCategories,
	findInfo : findInfo,
	mainFind : mainFind,
	userFind : userFind,
	getRecentLoans : getRecentLoans
};







module.exports = apiInfo;




