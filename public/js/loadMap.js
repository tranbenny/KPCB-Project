// draws the map
// need to add circles to map and draw circles on them


// Plan
// need to figure out a system that maps sectors and locations together 

var loanInformation = {}; // Key: UserID, Value:Array of loans
var countries = []; // array of all countries
var countryLocations = {}; // Key : countries, value : longitude/latitude values 
// returns most recent loans made 
var recentLoansURL = "http://api.kivaws.org/v1/lending_actions/recent.json";
var sectorLocations = {}; // Key : country, value : array of sectors



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

	// need to add function to clicking now 
	// make ajax request corresponding to write functions
	// api request needs location and sector 
	map.addListener("clickMapObject", function(event) {
		
		var country = event.mapObject.enTitle;
		$('#modal-body').empty();
		// console.log(event.mapObject);
		$('#modal-body').append(country);
		$('#myModal').modal('show');


		$('#results').empty();	
		var result = findImpact(country);
		$('#results').append("You clicked me!" + result);



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
	// console.log(loanInformation);
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
function findImpact(country) {
	var sector = sectorLocations[country];
	// sector name will be sector[0];
	var requestOptions = {
		type : "GET",
		dataType : "JSON", 
		data : {
			location : country
		},
		success : function(result) {
			// return appropriate html code to visualize impact
		}, 
		error : function(error) {
			return "Error occured";
		}
	};
	$.ajax("/api/" + sector, requestOptions);
}

























