// Errors/Conditions to fix: 
// need to account for if sector is undefined in a country


// Features/Functions to add:
// process JSON information upon clicks





// handling multiple ajax requests that pend for too long
// this needs to filter so that the abort function only deletes the most recent one
var xhrPool = [];
// all ajaxSend handlers are invoked regardless of what ajax request is being sent
// everytime ajaxSend handler is executed, passed event, jqXHR object = request, settings option of ajax request
$(document).ajaxSend(function(event, jqXHR, options) {
	xhrPool.push(jqXHR);
});


// after each ajax request, filters out the requests that are not XML HTTP Requests
$(document).ajaxComplete(function(e, jqXHR, options) {
	xhrPool = $.grep(xhrPool, function(x) {
		return x != jqXHR;
	});
});

function abort() {
	$.each(xhrPool, function(idx, jqXHR) {
		jqXHR.abort();
	});
}




var loanInformation = {}; // Key: UserID, Value:Array of loans
var countries = []; // array of all countries
var countryLocations = {}; // Key : countries, value : longitude/latitude values 
// returns most recent loans made 
var recentLoansURL = "http://api.kivaws.org/v1/lending_actions/recent.json";
var sectorLocations = {}; // Key : country, value : array of sectors
var countryCodes = {};


function findAllInformation(callback) {
	var loadLoanOptions = {
		type : "GET", 
		dataType : "json", 
		success : function(result) {
			/*
			console.log("Found information!");
			var loans = result.lending_actions;
			processLoan(loans); */
			var loans = result.lending_actions;
			processLoan(loans);
			callback();
			// process only the first 20 loaning actions
			
			// loanInformation = object where key is lenderID and value is array of all loans
		},
		error : function(err) {
			console.log("Error occured" + err);
			$('#mapdiv').append("Error Retrieving Data");
		}
	};
	$.ajax(recentLoansURL, loadLoanOptions);
};

findAllInformation(gatherLocations);


function drawMap() {
	var map = new AmCharts.AmMap();
	map.pathToImages = "css/images/";

	// images property to add images 
	var dataProvider = {
		map : "worldHigh",
		getAreasFromMap : true, 
		images : [],
	};

	// adds all the location values to draw circles
	// map location and sector values <--
	for (var userID in loanInformation) {
		var loans = loanInformation[userID]; 
		loans.forEach(function(value, index, array) {
			var country = value.location.country_code;
			if (!(value.location.country in countryCodes)) {
				countryCodes[value.location.country] = value.location.country_code;
			}
			var lat = countryLocations[country].lat;
			var lon = countryLocations[country].lon;
			var image = {
				type : "circle",
				label : value.location.country, 
				latitude : lat,
				longitude : lon
			}; 
			dataProvider.images.push(image);
			if (value.location.country in sectorLocations) {
				sectorLocations[value.location.country].push(value.sector);
			} else {
				sectorLocations[value.location.country] = [value.sector];
			}
		});
	}
	
	map.dataProvider = dataProvider;

	
	map.areasSettings = {
		autoZoom : false,
		selectedColor: "#CC000",
		selectable : true,
	};

	
	// process json results
	map.addListener("clickMapObject", function(event) {
		
		var country = event.mapObject.enTitle;
		var sectors = sectorLocations[country];
		$('#modal-body').empty();
		// console.log(event.mapObject);
		$('#modal-body').append(country + " ");
		$('#modal-body').append("Sectors: ");
		sectors.forEach(function(value, index, array) {
			$('#modal-body').append(" " + value);
		});
		$('#myModal').modal('show');

		// end any previous requests
		abort();

		// set it up so that if there is no data found to load up an alert
		$('#results').empty();	
		var result = findImpact(country, function(data) {
			// data here is a js object
			// data.result = array of objects
			if (Object.keys(data).indexOf("message") != -1) {
				$('#results').append("Sorry the data for this sector has not yet been loaded");
			} else {

				var information = data.result; 
				var countryInformation = {
					"country" : country,
					"sector" : sectorLocations[country][0]
				};
				$('#results').append(country + "<br />");
				$('#results').append(countryInformation.sector + "<br />");
				// make a new function right here
				processResponse(information, countryInformation);
			}
			


			// $('#results').append("Message: " + data.message);
		});
		// $('#results').append("You clicked me!" + result);



	});

	map.write("mapdiv");
};


function processLoan(loans) {
	for (var i = 0; i < 20; i++) {
		var loan = loans[i];
		var country = loan.loan.location.country_code;
		countries.push(country);
		if (loan.lender.lender_id in loanInformation) {
			loanInformation[loan.lender.lender_id].push(loan.loan);
		} else {	
			loanInformation[loan.lender.lender_id] = [loan.loan];
		}
	};
}




function gatherLocations() {
	$.ajax("/api/Location", {
		type : "GET",
		dataType : "json", 
		data : {
			countryNames : countries,
		},
		success : function(result) {
			countryLocations = result;
			drawMap();
		}, 
		error : function(err) {
			console.log("Error occured" + err);
		}
	});
}


// needs country location
// sends ajax request to fetch country/sector statistics
// success function needs to return appropriate html code
function findImpact(country, callback) {
	var sectors = sectorLocations[country];// this is an array
	var sector = sectors[0];
	var countryCode = countryCodes[country];
	// sector name will be sector[0];
	var requestOptions = {
		type : "GET",
		dataType : "JSON", 
		data : {
			location : country
		},
		success : function(result) {
			// return appropriate html code to visualize impact
			// if statement to check if the message is data or not
			console.log(result);
			//
			callback(result);
		}, 
		error : function(error) {
			return "Error occured";
		}
	};
	$.ajax("/api/" + countryCode + "/" + sector, requestOptions);
}

function processResponse(information, countryInformation) {
	information.forEach(function(value, index, array) {
		// information should contain two arrays of size 2 that contain two different variables
		var title = value[1][0].indicator.value;
		countryInformation[title] = [];
		$('#results').append(title + "<br />");
		var coreInformation = value[1]; // this is an array of objects
		coreInformation.forEach(function(v, i, a) {
			if (v.value != null) {
				countryInformation[title].push({
					"date" : v.date,
					"value" : v.value
				});
				$('#results').append(v.date + " : " + v.value + "<br />");
			}
		});
	});
}























