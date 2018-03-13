var jsonStr = "";

$(document).ready(function() {
	
	
	
	$("#getRandomQuote").on("click", function(){
		console.log("Get Random button is clicked");
		$("#quote").html("Here is the message");
		$.getJSON("/json/quotes.json",function(json){
			jsonStr = JSON.stringify(json);
			$("#quote").html(jsonStr);
		});
	});
});

