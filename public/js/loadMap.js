// loads recent loans onto map on web page
// ends ajax requests when a new one is made



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

// finds most recent loans and draws map on load
// adds user click function to search button
(function() {
	findAllInformation();
	$('#searchButton').click(function() {
		$('#mapdiv').empty();
		$('#mapdiv').append("<h1>Searching...</h1>");
		search();
	});
})();

// finds the most recent loans made on Kiva
function findAllInformation() {
	var loadLoanOptions = {
		type : "GET", 
		dataType : "json", 
		success : function(result) {
			var loans = result.result.lending_actions;
			var recentLoanMap = new Map(loans, false);
		},
		error : function(err) {
			console.log("Error occured" + err);
			$('#mapdiv').append("Error Retrieving Data");
		}
	};
	$.ajax("/api/recentLoans", loadLoanOptions);
};


// find all the loans corresponding to a searched lender 
function search() {
	var username = $('#username').val();
	var url = "/api/lendor/" + username;
	var options = {
		type : "GET", 
		dataType : "json", 
		success : function(result) {
			var loans = result.result.loans;
			var userMap = new Map(loans, true, username);
		},
		error : function(err) {
			console.log("Error occured" + err);
			$('#mapdiv').append("Error Retrieving Data");
		}
	};
	$.ajax(url, options);
}






