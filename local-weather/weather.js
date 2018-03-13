
var lat = 0;
var lon = 0;
var url = "https://fcc-weather-api.glitch.me/";
var jsonWeather;
var tempC = 0;
var tempF = 0;
$(document).ready(function(){
	function convertToF(c){
		return c * 9/5 + 32;
	}
	
	function precisionRound(number, precision) {
		// round a number with precision
		var factor = Math.pow(10, precision);
		return Math.round(number * factor) / factor;
	}
	
	// AIzaSyBL4610vCvAlA1Si1pk8DMx8SfuD7Dq0s8
	//alert("Ready mate");
	// READ: https://api.jquery.com/jquery.get/
	// to learn how capture done(), fail() and always()
	function sendRequestFCC(link){
		$.get(link, function(data){
			jsonWeather = data;
			//alert("Load was performed.");
			$("#location").html(jsonWeather.name + ", " + jsonWeather.sys.country);
			$("#icon").attr("src", jsonWeather.weather[0].icon);
			// Math.round(num * 100) / 100
			tempC = Math.floor(jsonWeather.main.temp);
			tempF =  Math.floor(convertToF(tempC));
			$("#temperature").html(tempC);
			$("#status").html(jsonWeather.weather[0].main);
			$("#humidity").html(jsonWeather.main.humidity);
			$("#windSpeed").html(jsonWeather.wind.speed);
		});
	}
	
	// get geolocation
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			lat = precisionRound(position.coords.latitude, 2);
			lon = precisionRound(position.coords.longitude, 2);
			console.log(lat + " - " + lon);
			url += "/api/current?lon=" +lon + "&lat="+lat;
			console.log(url);
			sendRequestFCC(url);			
		});
	};
	
	$("#convertToC").on("click", function(){
		$("#temperature").html(tempC);
	});
	$("#convertToF").on("click", function(){
		$("#temperature").html(tempF);
	});
});