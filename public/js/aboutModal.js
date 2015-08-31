$('#about').click(function() {
	$('#modal-body').empty();
	$('#modal-body').append("<p>Home page shows the locations of the 50 most recent loans made on Kiva on a map. When a country with a dot " + 
	"is clicked, information about the loan and its effect on the country is loaded under the map. </p>" +
	"<p>Enter username in the search bar to find all the loans from a particular lender.</p>" +
	"<p>Loan/Lender information comes from Kiva. </p>" +
	"<a href='http://www.kiva.org/home'>http://www.kiva.org/home</a>" + 
	"<p>Impact data comes from the World Bank. </p>" + 
	"<a href='http://data.worldbank.org/'>http://data.worldbank.org/</a>"
	);








	$('#myModal').modal('show');
});


