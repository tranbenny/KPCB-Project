// configure all the methods to get all the relevant agricultural information
// configure it all into fields and methods, similar to OOP principles 
var request = require('request');

// map relevant data from other API's to information about loan
var apiInfo= {
	"World Bank" : "Agriculture & Rural Development" 
	 // crop production index, food production index, agriculture value added per worker
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
	apiInfo : apiInfo,
	findInfo : findInfo	
};




module.exports = apiInfo;