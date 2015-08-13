// map relevant data from other API's to information about loan
var categoryMap = {
	"Agriculture" : {
		"World Bank" : "Agriculture & Rural Development" 
		 // crop production index, food production index, agriculture value added per worker
	},
}



var options = {
	type : "GET",
	dataType : "json", 
	success : function(result) {
		findLoans(result);
	}, 
	error : function(result) {
		console.log("Error retrieving information" + result);
	}
};

// result will be an object with loan data
function findLoans(result) {	
	var lenders = result.lenders;
	$('#lenders').append("<ul>");
	lenders.forEach(function(value, index, array) {
		// all the values are objects
		$('#lenders').append("<li> Name: " + value.name + ", Username: " + value.uid + "</li>");
	});
	$('#lenders').append("</ul>");
	//var loans = result.loans; // array of objects
	/*
	loans.forEach(function(value, index, array) {
		console.log(value);
	}); */
	// every loan value is an object
	// id, lender count, 
};



// $.ajax("http://api.kivaws.org/v1/loans/newest.json", options);

// find one individual lender first
//$.ajax("http://api.kivaws.org/v1/lenders/search.json", options);

// gathering the information for individual users




var individualOptions = {
	type : "GET", 
	dataType : "json", 
	success : function(result) {
		printLoans(result);
	}, 
	error : function(result) {
		console.log("Error occured" + result);
	}

}

// now i want to find all the information about one user
$.ajax("http://api.kivaws.org/v1/lenders/brent5752/loans.json", individualOptions);


function printLoans(result) {
	var loanInfo = result.loans; // array of objects
	// work with individual loan right now
	var example = loanInfo[1];
	// in the example, i have
	// loan id = 883679
	// activity = Farming
	// location = Philippines
	// sector = "Agriculture"
	// use  = "to purchase fertilizer"
	// loan_amount  = 6
	console.log(example);
	// load the modal with relevant information and impact 
}
