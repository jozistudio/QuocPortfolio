var jsonStr = "";
var path = "https://jozistudio.github.io/QuocPortfolio/";
var folderName = "quote-machine";
$(document).ready(function() {
	
	
	
	$("#getRandomQuote").on("click", function(){
		console.log("Get Random button is clicked");
		$("#quote").html("Here is the message");
		$.getJSON(path + "/json/quotes.json",function(json){
			jsonStr = JSON.stringify(json);
			$("#quote").html(jsonStr);
		});
	});
});

