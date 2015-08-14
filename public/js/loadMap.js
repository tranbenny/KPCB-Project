// draws the map
// need to add circles to map and draw circles on them

var loanInformation = {};
var recentLoansURL = "http://api.kivaws.org/v1/lending_actions/recent.json";
var loadLoanOptions = {
	type : "GET", 
	dataType : "json", 
	success : function(result) {
		console.log("Found information!");
		var loans = result.lending_actions;
		// process only the first 20 loaning actions
		for (var i = 0; i < 20; i++) {
			var loan = loans[i];
			if (loan.lender.lender_id in loanInformation) {
				loanInformation[loan.lender.lender_id].push(loan.loan);
			} else {	
				loanInformation[loan.lender.lender_id] = [loan.loan];
			}
		};
		// console.log(loanInformation);
		// save all the location information with their loan ID's
	},
	error : function(err) {
		console.log("Error retrieving data" + err);
	}
};
// will get object, result.lending_actions == array of objects

$.ajax(recentLoansURL, loadLoanOptions);


AmCharts.ready(function() {
	var map = new AmCharts.AmMap();
	map.pathToImages = "css/images/";

	var dataProvider = {
		map : "worldHigh",
		getAreasFromMap : true, 
	};

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
});


























