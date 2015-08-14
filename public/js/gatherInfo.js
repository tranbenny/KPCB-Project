// map relevant data from other API's to information about loan

// the ajax call needs to send the location and sector information
var country;
var sector;


var individualOptions = {
	type : "GET", 
	dataType : "json", 
	success : function(result) {
		extractInformation(result);
	}, 
	error : function(error) {
		console.log("Could not find loan information" + error);
	}
}


function extractInformation(result) {
	var loanInfo = result.loans;
	var example = loanInfo[1]; // object
	var country = example.location.country_code; // PH
	var sector = example.sector; // Agriculture
	var exampleOptions = {
		type : "GET",
		dataType : "json",
		processData : false,
		data : {
			location : country,
			category : sector 
		},
		success : function(result) {
			$('#lenders').append(result);
		}, 
		error : function(error) {
			console.log("Error occured" + error);
		}
	};
	$.ajax("/api/" + str(sector), exampleOptions);
}


// now i want to find all the information about one user
// $.ajax("http://api.kivaws.org/v1/lenders/brent5752/loans.json", individualOptions);



