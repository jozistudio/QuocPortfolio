var jsonGlobal;
var defaultTxt = "Click icon to search";
var loadingTxt = "Loading...";
var noResultTxt = "There were no results matching the query";

$(document).ready(function() {
	$('#searchBtn').click(function () {
		console.log('button clicked');
		//$('.btn-group').css('display', 'inline');
		$('#searchGroup').show();
		$('#searchBtn').hide();
		// place cursor in input field
		$('#searchInput').focus();
	});

	$('#searchClearBtn').click(function(){
		$('#searchInput').val('');
		$('#searchGroup').hide();
		$('#searchBtn').show();
		
		// display notification
		$('#notificationTxt').show();
		$('#notificationTxt').text(defaultTxt);
		// reframe main-div to center both direction
		$('#main-div').removeClass('center-horizontal-div').addClass('center-both-div');
		// clear (previous) result
		$('#wikiItems').html('');
	});

	$('#searchInput').on("keyup", function(e){
		if (e.keyCode == 13){
			console.log("Enter is pressed.");
			var keyword = $('#searchInput').val();
			var url = "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&gsrsearch=";
			url += keyword + "&utf8=";
			console.log(url);
			
			/*
			https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=jsonfm&exintro=&titles=pizza
			https://en.wikipedia.org/w/api.php?action=search&titles=pizza&prop=revisions&rvprop=content&format=jsonfm&formatversion=2
			action: query
			list: search
			srsearch: keyword
			https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=pizza&utf8=
			for readable purpose
			https://en.wikipedia.org/w/api.php?action=query&list=search&format=jsonfm&srsearch=pizza&utf8=
			// https://en.wikipedia.org/w/api.php?action=query&format=json&gsrlimit=15&generator=search&origin=*&gsrsearch=pizza
			case: no result in search
			https://en.wikipedia.org/w/api.php?action=query&list=search&format=jsonfm&srsearch=pizzaddd2&utf8
			*/
			
			makeCorsRequest(url);
			// show loading text
			$('notificationTxt').text(loadingTxt);
			// reframe the main div
			$('#main-div').removeClass('center-both-div').addClass('center-horizontal-div');
			// clear (previous) result
			$('#wikiItems').html('');
		}
	});
	
	
	function showResult(resp){
		console.log("Start to parse JSON");
		// convert text to JS object
		jsonGlobal = JSON.parse(resp);
		var items = jsonGlobal.query.search;
		if (items.length <=0){
			// there is no result 
			console.log("There is no result.");
			// show notifitcation 
			$("#notificationTxt").text(noResultTxt);
			// clear the (previous) items
			$("#wikiItems").html("");
		} else {
			// hide the notification
			$("#notificationTxt").text('');
			// get the div which will contain all items
			var list = $("#wikiItems");
			items.forEach(function(item){
			console.log(item);
			// parse JSON to show on HTML content
			
			// APPEND NEW ELEMENT TO EXISITNG ELEMENT
			// REF: https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_html_append2
			/* EXAMPLE
			    var txt1 = "<p>Text.</p>";              // Create text with HTML
				var txt2 = $("<p></p>").text("Text.");  // Create text with jQuery
				var txt3 = document.createElement("p");
				txt3.innerHTML = "Text.";               // Create text with DOM
				$("body").append(txt1, txt2, txt3);     // Append new elements
			*/
			var itemHTML = '<div class="item">';
			// add external link for item
			var anc = '<a class="btn btn-responsive itemBtn" href="https://en.wikipedia.org/?curid=' + item.pageid + '" target="_blank"';
			
			// get title
			var title = '<h2>' + item.title + '</h2>';
			var snippet = '<p>' + item.snippet + '</p>';
			itemHTML += anc + title + snippet;
			itemHTML+= '</a></div>';
			
			$("#wikiItems").append(itemHTML);
			
			
		});
		}
		
	}
	
	
	/* Cross-Origin Resource Sharing - CORS
	// https://www.html5rocks.com/en/tutorials/cors/
	onloadstart*	When the request starts.
	onprogress		While loading and sending data.
	onabort*		When the request has been aborted. For instance, by invoking the abort() method.
	onerror			When the request has failed.
	onload			When the request has successfully completed.
	ontimeout		When the author specified timeout has passed before the request could complete.
	onloadend*		When the request has completed (either in success or failure).
	
	MUST INSTALL CHROME EXTENSION TO MAKE IT WORK LOCALLY
	https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
	REF: https://stackoverflow.com/a/38000615/5554576
	*/
	// Create the XHR object.
	function createCORSRequest(method, url){
		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr){
			// XHR for Chrome/Firefox/Opera/Safari.
			xhr.open(method, url, true);
			
		} else if (typeof XDomainRequest != "undefined"){
			// XDomainRequest for IE.
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} else {
			xhr = null;
		}
		
		xhr.withCredentials = true;
		return xhr;
	}
	// Helper method to parse the title tag from the response.
	function getTitle(text) {
		return text.match('<title>(.*)?</title>')[1];
	}
	
	// Make the actual CORS request.
	function makeCorsRequest(link){
		// This is a sample server that supports CORS.
		var url = '';
		
		var xhr = createCORSRequest('GET', link);
		if (!xhr){
			alert('CORS not supported');
			return;
		}
		//xhr.setRequestHeader('X-Custom-Header', 'value');
	//	xhr.setRequestHeader('Access-Control-Request-Origin', 'http://localhost');
		xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
		//xhr.setRequestHeader('origin', link);
		//xhr.setRequestHeader("origin", "*");
		
		// Response handlers.
		xhr.onload = function() {
			var resp = xhr.responseText;
			console.log(resp);
			// parse data from json
			showResult(resp);
			
			//alert('Response from CORS request to ' + url + ':' + title);
		}
		
		xhr.onerror = function() {
			alert('Woops, there was an error making the request.');
			//var resp = xhr.responseText;
			//console.log('Still got json --- ' + resp);
		}
		console.log(xhr);
		xhr.onloadend = function(){
			//alert(xhr.responseText);
		}
		
		xhr.send();
	}
	/* END CORS ----------------------*/
	/* 
	THIS METHOD WILL NOT WORK LOCALLY BECAUSE 
	CHROME DOES NOT ACCEPT CROSS-ORIGIN RESOURCE SHARING
	
	function sendRequest(link){
		// https://developer.chrome.com/extensions/xhr
		//https://www.html5rocks.com/en/tutorials/cors/
		var xhr = new XMLHttpRequest();
		xhr.open("GET", link, true);
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4){
				var resp = JSON.parse(xhr.responseText);
				console.log(resp);
				$("#tmpText").html(xhr.responseText);
			}
		}
		xhr.send();
	}
	*/
	
});