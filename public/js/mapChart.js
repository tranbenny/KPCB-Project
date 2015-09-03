// map object
// takes an array of loans, boolean value if the loans are specific to one user, and a username as parameters
// draws map onto the webpage


// Map Object constructor 
function Map(loans, userSpecific, username) {
	this.loans = loans; // array of loan objects
	this.specificUser = userSpecific; // true or false if loans are all by one user
	this.username = username; // username of loans passed

	// creates new map on load and adds click function
	(function () {
		var loanInformation = {}; // Key: UserID, Value: Array of loans
		var countries = []; // array of all countries
		var countryLocations = {}; // Key : countries, value : longitude/latitude values 
		// Key : country, value : Array of objects, the objects need to include the sector, loan information, user ID 
		var sectorLocations = {}; 
		var countryCodes = {};

		main();

		function main() {
			processLoans(loans);
			gatherLocations();
		}

		function processLoans(loans) {
			if (userSpecific == false) {
				var number = 50;
			} else {
				var number = loans.length;
			}
			for (var i = 0; i < number; i++) {
				if (userSpecific == false) {
					var loan = loans[i].loan;
					var user = loans[i].lender.lender_id;
				} else {
					var loan = loans[i];
					var user = username;
				}
				var country = loan.location.country_code;
				countries.push(country);
				if (user in loanInformation) {
					loanInformation[user].push(loan);
				} else {	
					loanInformation[user] = [loan];
				}
			}
		}

		// finds all the latitude/longitude values for countries
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

		// configures and draws amChart map onto web page
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
			for (var userID in loanInformation) {
				var loans = loanInformation[userID]; // an array of object loans
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
			}
			
			map.dataProvider = dataProvider;

			map.areasSettings = {
				autoZoom : false,
				selectedColor: "#CC000",
				selectable : true,
			};

			// adds click function to loan countries on map
			map.addListener("clickMapObject", function(event) {
				abort(); // ends previous ajax requests
				$('#results').empty(); 
				var country = event.mapObject.enTitle;
				var sectors = [];
				// this is an array of objects
				sectorLocations[country].forEach(function(value, index, array) {
					sectors.push(Object.keys(value)[0]); // FIX THIS
				});

				var result = findImpact(country, function(data) {
					if (Object.keys(data).indexOf("message") != -1) {
						$('#results').append('<h3 class="center">Sorry the data for this sector has not yet been loaded</h3>');
					} else {
						var information = data.result; 
						var countryInformation = {
							"country" : country,
							"sector" : Object.keys(sectorLocations[country][0])[0] 
						};
						processResponse(information, countryInformation);
					}
				});
			});
			$('#load').hide();
			map.write("mapdiv");
		};

		// finds the relevant information from WorldBank API for a specific country/sector
		function findImpact(country, callback) {
			var sectors = sectorLocations[country]; // this is an array of objects
			var sector = Object.keys(sectors[0])[0];
			var countryCode = countryCodes[country];
			// sector name will be sector[0];
			var requestOptions = {
				type : "GET",
				dataType : "JSON", 
				data : {
					location : country
				},
				success : function(result) {
					callback(result);
				}, 
				error : function(error) {
					return "Error occured " + error;
				}
			};
			$.ajax("/api/" + countryCode + "/" + sector, requestOptions);
		}

		// loads country/sector information onto a graph in the results section of the web page
		function processResponse(information, countryInformation) {
			var image;
			var name;
			var activity;
			var use;
			sectorLocations[countryInformation.country].forEach(function(value, index, array) {
				if (Object.keys(value)[0] == countryInformation.sector) {
					console.log(value[countryInformation.sector]);
					image = value[countryInformation.sector].image.id;
					name = value[countryInformation.sector].name;
					activity = value[countryInformation.sector].activity;
					use = value[countryInformation.sector].use;
				}
			}); 
			$('#results').append("<h1 class='underline'>Loan Information</h1>")
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

			// chart dimensions
			var WIDTH = 800;
			var HEIGHT = 500;
			var MARGINS = {
				top : 40,
				right : 40,
				bottom : 40, 
				left : 70
			};

			information.forEach(function(value, index, array) {
				try {
					var title = value[1][0].indicator.value; // y-value
				} catch(err) {
					var title = "undefined";
				}
				var chartId = "chart" + index;
				$('#results').append('<div class="row"><svg id="' + chartId + '"></svg>');
				countryInformation[title] = [];
			
				var coreInformation = value[1]; 
				
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

	})();
}

Map.prototype = {
	constructor : Map,
}