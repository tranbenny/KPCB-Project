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
		$('#modal-content').empty();
		$('#modal-content').append(event.mapObject.enTitle);
		$('#myModal').modal('show');
	});

	map.write("mapdiv");
});


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
	var loans = result.loans; // array of objects
	loans.forEach(function(value, index, array) {
		console.log("Please help " + value.name);
	}); 


};







$.ajax("http://api.kivaws.org/v1/loans/newest.json", options);



















