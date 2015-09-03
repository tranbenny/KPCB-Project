// Errors/Conditions to fix: 
// need to account for if sector is undefined in a country
// fix latitude/longitude values for Samoa
// need to fix null value iterations


// Features/Functions to add:

// figure out how to deal with undefined values
// need to add more world bank information


// add more things to be loaded for each sector
// How do I want to load unknown values?

// Customize navigation bar 
// Create the theme to match website
// load user profiles instead of all the loans
// clean up code



//////////////////////////////////////////
// handle ajax requests


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

///////////////////////////////////////////
// draw map on load

(function() {
	findAllInformation();
	$('#searchButton').click(function() {
		$('#mapdiv').empty();
		$('#mapdiv').append("<h1>Searching...</h1>");
		search();
	});
})();


function findAllInformation() {
	var loadLoanOptions = {
		type : "GET", 
		dataType : "json", 
		success : function(result) {
			var loans = result.result.lending_actions;
			console.log(loans);
			var recentLoanMap = new Map(loans, false);
		},
		error : function(err) {
			console.log("Error occured" + err);
			$('#mapdiv').append("Error Retrieving Data");
		}
	};
	$.ajax("/api/recentLoans", loadLoanOptions);
};


// find all the loans corresponding to a lender 
function search() {
	var username = $('#username').val();
	var url = "/api/lendor/" + username;
	var options = {
		type : "GET", 
		dataType : "json", 
		success : function(result) {
			var loans = result.result.loans;
			console.log(loans);
			var userMap = new Map(loans, true, username);
		},
		error : function(err) {
			console.log("Error occured" + err);
			$('#mapdiv').append("Error Retrieving Data");
		}
	};
	$.ajax(url, options);
}






