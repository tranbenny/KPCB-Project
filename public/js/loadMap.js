AmCharts.ready(function() {
	var map = new AmCharts.AmMap();
	map.pathToImages = "css/images/";

	var dataProvider = {
		map : "worldHigh",
		getAreasFromMap : true
	};

	map.dataProvider = dataProvider;

	
	map.areasSettings = {
		autoZoom : true,
		selectedColor: "#CC000"
	};

	map.write("mapdiv");
});