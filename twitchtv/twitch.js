var jsonGlobal;
var userList = ["ESL_SC2", "OgamingSC2", "geschampionship", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "spygea", "aphromoo", "tsm_hamlinz"];
var template = '<div class="item">			<div class="banner">				</div>			<div class="description">				<div class="top">					<div class="logo">					</div>					<div class="display_name">						<h2 class="name"></h2>						<div class="follower">										</div>					</div>				</div>				<div class="bottom">				</div>			</div>		</div>';
var imgBroken = "https://goo.gl/akG9Py";
$(document).ready(function() {
	// send requests to get data
	loadData();	
	
	// addEventListener is not working for JQuery object
	// addEventListener is used for JS object
	// bind() is deprecated
	// on(events, handler) is current event handler attachment
	$("#showAll").on("click", function(){
		$(".online").show();
		$(".offline").show();
	});
	$("#showOffline").on("click", function(){
		$(".online").hide();
		$(".offline").show();
	});
	$("#showOnline").on("click", function(){
		$(".online").show();
		$(".offline").hide();
	});
	
	function getChannelFromLink(url){
		var a = url.split("/");
		if (a.length > 0)
			return a[a.length-1];
		else 
		{
			console.log(url + " is not a valid url.");
			return null;
		}		
	}
	
	function imgError(image){
		image.onerror ="";
		image.src = "https://goo.gl/akG9Py";
		return true;
	}
	
	function loadData(){
		userList.forEach(function(item){
			makeRequest("streams", item);
		});
	}
	
	function makeRequest(routeOption, userID){
		var url = "https://wind-bow.gomix.me/twitch-api/" + routeOption + "/" + userID + "?callback=?";
		$.getJSON(url, function(data) {
			if (data == null){
				console.log("Cant get JSON from " + url);
				return;
			}
			else 
				process(data);
		});
	}
	
	function process(data){
		if (data.hasOwnProperty("stream")){	
			if (data.stream == null){
				// stream is offline -- request bio 
				var user = getChannelFromLink(data._links.self);
				if (user != null)
					makeRequest("channels", user);
			} else {
				// convert data to UI
				updateUI(data, true);
			}
		} else {
			// online streams will not return bio property
			// means this stream is offline
			updateUI(data, false);
		};
	}
	
	function updateUI(data, isOnline){
		// insert new template to list
		$("#itemList").append(template);
		var item = $("#itemList").children().last();
		
		if (isOnline){
			item.addClass('online');
			// parse JSON data to UI for online stream
			//console.log(data.stream);
			var stream = data.stream;
			
			// bind banner's image
			var banner = item.find(".banner");
			if (banner != null){
				var img = '<img src="' + stream.preview.medium + '"/>';
				banner.append(img);
			}
			// bind channel details
			var logo = item.find(".logo");
			if (logo != null){
				var anc = '<a href="' + stream.channel.url + '" target="_blank">';
				var img = '<img src="' + stream.channel.logo + '"/>';
				anc += img + '</a>';
				logo.append(anc);
			}
			var name = item.find(".name");
			if (name != null){
				var anc = '<a href="' + stream.channel.url + '" target="_blank">';
				anc += stream.channel.display_name + '</a>';
				name.append(anc);
			}
			var follower = item.find(".follower");
			if (follower != null){
				follower.append("Followers: " + stream.channel.followers);
			}
			
			// bind current activity
			var bottom = item.find(".bottom");
			if (bottom != null){
				var viewers = '<p>' + stream.viewers + ' viewers are watching: </p>';
				var anc = viewers + '<a href="' + stream.channel.url + '" target="_blank"></a>';
				bottom.append(anc);
				bottom.append('<h4 class="status">'+stream.channel.status					
					+ '<span> on <a '
					+ ' href="https://www.twitch.tv/directory/game/' + stream.channel.game
					+ '" target="_blank">' + stream.channel.game + '</a></span>'					
					+ '</h4>');
			}
		} else {
			item.addClass('offline');
			// parse JSON data to UI for offline stream
			// bind banner's image
			var banner = item.find(".banner");
			if (banner != null){
				if (data.video_banner == null)
					var img = '<img  onerror="imgError(this);" src="' + imgBroken+ '"/>';
				else 
					var img = '<img  onerror="imgError(this);" src="' + data.video_banner + '"/>';
				banner.append(img);
			}
			// bind channel details
			var logo = item.find(".logo");
			if (logo != null){
				var anc = '<a href="' + data.url + '" target="_blank">';
				var img = '<img onerror="imgError(this);" src="' + data.logo + '"/>';
				anc += img + '</a>';
				logo.append(anc);
			}
			var name = item.find(".name");
			if (name != null){
				var anc = '<a href="' + data.url + '" target="_blank">';
				anc += data.display_name + '</a>';
				name.append(anc);
			}
			var follower = item.find(".follower");
			if (follower != null){
				follower.append("Followers: " + data.followers);
			}
			
			// bind current activity
			var bottom = item.find(".bottom");
			if (bottom != null){
				var viewers = '<p>The channel is currently offline.</p>';
				var anc = viewers + '<a href="' + data.url + '" target="_blank"></a>';
				bottom.append(anc);
				if (data.status != null){
					var stats = '<h4 class="status">'+ data.status;
					if (data.game != null)
						stats += '<span> on <a '
								+ ' href="https://www.twitch.tv/directory/game/' + data.game
								+ '" target="_blank">' + data.game + '</a></span>';
								
					stats += '</h4>';
					
					bottom.append(stats);
				}
			}
		}
	}
		
		
		
	// Not found specific user
	//({"error":"Not Found","status":404,"message":"User \"freecodesdasdasdcdamp\" was not found"});
	// off line stream
	// ({"stream":null,"_links":{"self":"https://api.twitch.tv/kraken/streams/freecodesdasdasdcdamp","channel":"https://api.twitch.tv/kraken/channels/freecodesdasdasdcdamp"}});
	
	

	
	//var url = "https://wind-bow.gomix.me/twitch-api/streams/ESL_SC2?callback=?";
	/*
	var url = "https://wind-bow.gomix.me/twitch-api/users/freecodecamp?callback=?";
	$.getJSON(url, function(data) {
		jsonGlobal = data;
		console.log(jsonGlobal);
		
		if (jsonGlobal.hasOwnProperty("stream")){
			var stream = jsonGlobal.stream;
			var links = stream.channel._links;
			console.log(stream.display_name);
			$("h4").html(stream.channel.status);
			$("img").css("src", stream.preview.medium);
			$("#streamerVideoURL").html(links.videos);
		} else {
			console.log("can't parse json to display data");
		}
		
	});
	*/
	
});