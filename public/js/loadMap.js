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


























