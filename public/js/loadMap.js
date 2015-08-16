// draws the map
// need to add circles to map and draw circles on them


// Plan
// make api call, send information about countries
// api call should return an object with all the countries and latitude and longitude values
// need to configure new api route

var loanInformation = {};
var countries = [];
var countryLocations = {};
var recentLoansURL = "http://api.kivaws.org/v1/lending_actions/recent.json";

// will get object, result.lending_actions == array of objects

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
			promise.reject(new Error(err));
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

	for (var userID in loanInformation) {
		var loans = loanInformation[userID]; // array
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
		});
	}

	// console.log(countryLocations);
	
	map.dataProvider = dataProvider;

	
	map.areasSettings = {
		autoZoom : false,
		selectedColor: "#CC000",
		selectable : true,
	};

	map.addListener("clickMapObject", function(event) {
		//console.log(event.mapObject.enTitle);
		// load up a little text box with its name 
		$('#modal-body').empty();
		$('#modal-body').append(event.mapObject.enTitle);
		$('#myModal').modal('show');
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
	// console.log(countries);
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

























