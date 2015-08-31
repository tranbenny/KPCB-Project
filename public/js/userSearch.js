// get the loans
// get the locations of all the loans
// draw the map with the locations
// add the click functions

var userCountryLocations;
var userCountries = [];
var userLoans = {};
var userCountryLocations = {};
var username;
var userSectorLocations = {};


$('#searchButton').click(function() {
	userSectorLocations = {};
	$('#mapdiv').empty();
	$('#mapdiv').append("<h1>Searching...</h1>")
	search();
});


// find all the loans corresponding to a lender 
function search() {
	username = $('#username').val();
	userLoans[username] = [];
	var url = "/api/lendor/" + username;
	var options = {
		type : "GET", 
		dataType : "json", 
		success : function(result) {
			// result is all the loans
			console.log(result);
			processUserLoan(result.result);
			gatherUserLocations(result.result);
		},
		error : function(err) {
			console.log("Error occured" + err);
			$('#mapdiv').append("Error Retrieving Data");
		}
	};
	console.log(url);
	$.ajax(url, options);
}


function processUserLoan(loans) {
	loans.loans.forEach(function(value, index, array) {
		var country = value.location.country_code;
		userCountries.push(country);
		userLoans[username].push(value);
	});
}

function gatherUserLocations(data) {
	$.ajax("/api/Location", {
		type : "GET",
		dataType : "json", 
		data : {
			countryNames : userCountries,
		},
		success : function(result) {
			userCountryLocations = result;
			drawUserMap();
		}, 
		error : function(err) {
			console.log("Error occured" + err);
		}
	});
}


function drawUserMap(result) {
	$('#mapdiv').empty();
	var map = new AmCharts.AmMap();
	map.pathToImages = "css/images/";

	// images property to add images 
	var dataProvider = {
		map : "worldHigh",
		getAreasFromMap : true, 
		images : [],
	};

	// need to get locations of loans
	userLoans[username].forEach(function(value, index, array) {
		console.log(value);
		var country = value.location.country_code;
		if (!(value.location.country in countryCodes)) {
			userCountryLocations[value.location.country] = value.location.country_code;
			countryCodes[value.location.country] = value.location.country_code;
		}
		var lat = userCountryLocations[country].lat;
		var lon = userCountryLocations[country].lon;
		var image = {
			type : "circle",
			label : value.location.country, 
			latitude : lat,
			longitude : lon
		}; 
		dataProvider.images.push(image);
		// key = country name
		// value = object with sectors, loans, images
		var sectorKey = value.sector;
		var imageLoanSector = {};
		imageLoanSector[sectorKey] = value;
		if (value.location.country in sectorLocations) {
			sectorLocations[value.location.country].push(imageLoanSector);
		} else {
			sectorLocations[value.location.country] = [imageLoanSector];
		}
	});

	map.dataProvider = dataProvider;

	
	map.areasSettings = {
		autoZoom : false,
		selectedColor: "#CC000",
		selectable : true,
	};

	map.addListener("clickMapObject", function(event) {
		abort(); // ends previous ajax requests
		$('#results').empty(); 
		var country = event.mapObject.enTitle;
		var sectors = [];
		// this is an array of objects
		userLoans[username].forEach(function(value, index, array) {
			if (value.location.country == country) {
				sectors.push(value.sector);
			}
		});

		var result = findUserImpact(country, sectors, function(data) {
			if (Object.keys(data).indexOf("message") != -1) {
				$('#results').append('<h3 class="center">Sorry the data for this sector has not yet been loaded</h3>');
			} else {
				var information = data.result; 
				var countryInformation = {
					"country" : country,
					"sector" : sectors[0] 
				};
				processUserResponse(information, countryInformation);
			}
		});
	});
	$('#load').hide();
	map.write("mapdiv");


}


function findUserImpact(country, sectors, callback) {
	// FIX THIS
	try {
		var sector = sectors[0];
	} catch(err) {
		var sector = "unknown";
	} 
	var countryCode = countryCodes[country]; // this is coming up as undefined, sometimes
	var requestOptions = {
		type : "GET",
		dataType : "JSON", 
		data : {
			location : country
		},
		success : function(result) {
			console.log(result);
			callback(result);
		}, 
		error : function(error) {
			return "Error occured " + error;
		}
	};
	$.ajax("/api/" + countryCode + "/" + sector, requestOptions);
}

// function draws the chart 
function processUserResponse(information, countryInformation) {
	// countryInformation.sector
	var oneLoan;
	var image;
	var name;
	var activity;
	var use;
	userLoans[username].forEach(function(value, index, array) {
		if (value.sector == countryInformation.sector && value.location.country == countryInformation.country) {
			oneLoan = value;
			image = value.image.id;
			name = value.name;
			activity = value.activity;
			use = value.use;
		}
	}); 

	$('#results').append("<h1 class='underline'>Loan Information</h1>");

	// array of objects
	// add an item description next to the image 
	$('#results').append("<div class='row' id='description'>" + 
		"<div class='col-md-4'>" +
			"<img src='http://www.kiva.org/img/s300/" + image + ".jpg'>" +
		"</div>" +
		"<div class='col-md-6'>" +
			"<h5> Name: " + name + "</h5>" +
			"<h5> Location: " + countryInformation.country + "</h5>" +
			"<h5> Activity: " + activity + "</h5>" +
			"<h5> Use: " + use + "</h5>" +
		"</div>" +
	"</div>");

	$('#results').append(
		"<h1 class='center' id='resultTitle'> Effect on " + countryInformation.sector + "/Employment in " +
		countryInformation.country + " </h1>"
	);

	// Drawing the chart
	var WIDTH = 800;
	var HEIGHT = 500;
	var MARGINS = {
		top : 40,
		right : 40,
		bottom : 40, 
		left : 70
	};

	information.forEach(function(value, index, array) {
		// information should contain two arrays of size 2 that contain two different variables
		// sometimes title values are null
		try {
			var title = value[1][0].indicator.value; // y-value
		} catch(err) {
			var title = "undefined";
		}
		var chartId = "chart" + index;
		$('#results').append('<div class="row"><svg id="' + chartId + '"></svg>');
		countryInformation[title] = [];
	
		var coreInformation = value[1]; // this is an array of objects
		
		var yMin = 0;
		var yMax = 0;
		coreInformation.forEach(function(v, i, a) {
			if (v.value != null) {
				countryInformation[title].push(
				[Number(v.date), Number(v.value)]);
				if (Number(v.value) < yMin) {
					yMin = Number(v.value);
				} else if (Number(v.value) > yMax) {
					yMax = Number(v.value);
				}
			}
		});

		console.log("Min: " + yMin + ", Max: " + yMax);
	
		var xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([2000, 2015]);
		var yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([yMin, yMax]);
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(15)
			.tickFormat(function(d) {
				return d;
			});
		var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(15);

	
		var svg = d3.select('#' + chartId).attr("width", WIDTH).attr("height", HEIGHT);
		svg.selectAll("circle")
			.data(countryInformation[title]).enter()
				.append("circle")
				.attr("cx", function(d) {
					return xScale(d[0]);
				})
				.attr("cy", function(d) {
					return yScale(d[1]);
				})
				.attr("r", 5);

		var valueLine = d3.svg.line()
			.defined(function(d) {
				return !isNaN(d[1]);
			})
			.x(function(d) {
				return xScale(d[0]);
			})
			.y(function(d) {
				return yScale(d[1]);
			}); 
		
		svg.append("svg:g").attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
			.attr("class", "axis").call(xAxis);
		svg.append("svg:g").attr("transform", "translate(" + (MARGINS.left) + ",0)")
			.attr("class", "axis").call(yAxis);
		svg.append("text").attr("class", "x-label")
			.attr("text-anchor", "end")
			.attr("x", WIDTH - 30)
			.attr("y", HEIGHT - 50)
			.text("Year");
		svg.append("text").attr("class", "y-label")
			.attr("text-anchor", "middle")
			.attr("y", 0)
			.attr("x", 0 - (HEIGHT / 2))
			.attr("dy", "0.75em")
			.attr("transform", "rotate(-90)")
			.text(title); 
		
		svg.append("path")
			.attr("id", "line")
			.attr("d", valueLine(countryInformation[title]));
				 
		$('#results').append("</div>");
	});
}

