var jsonStr = "";
var path = "https://jozistudio.github.io/QuocPortfolio/";
var folderName = "quote-machine";
var index = 0;
var counter = 0;
var quotes = undefined;
var singleQuote = undefined;

$(document).ready(function() {
	function updateQuote(q, a){
		$("#quote").html(q);	
		$("#author").html(a);	
	}
	
	$.getJSON(path + folderName + "/json/quotes.json",function(json){
		//jsonStr = JSON.stringify(json);
		jsonStr = json;
		quotes = jsonStr.quotes;
		counter = quotes.length; // get total number of items on JSON object
		if (counter > 0) {
			index = Math.floor(Math.random() * counter);
			console.log(index);
			updateQuote(quotes[index].quote, quotes[index].author);
		}		
		else 
			alert("Can't parse JSON file.");
	});
	
	
	$("#getRandomQuote").on("click", function(){
		index++;
		if (index >= counter)
			index = 0;
		updateQuote(quotes[index].quote, quotes[index].author);
	});
});

