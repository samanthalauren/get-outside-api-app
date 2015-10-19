var goOutside = {};

goOutside.mapKey = L.mapbox.accessToken = 'pk.eyJ1Ijoic2xhdXJlbmMiLCJhIjoiY2lmdDE4cW9yMXNuMmxma3I1M3RsanJxaCJ9.YSCgMOMuesrNw0qsjmhrvQ';
goOutside.map = L.mapbox.map('map', 'slaurenc.cift18pfx1t2br3krbrs3skmx');
goOutside.apiKey = 'aeb2215ccc9879117e28c30c9131e6db';

goOutside.icon = L.marker([], {
    icon: L.mapbox.marker.icon({
        'marker-size': 'large',
        'marker-color': '#fa0'
    })
});

//Method to connect to api and pull places data. 
goOutside.test = function() {
var apiUrl = 'https://outdoor-data-api.herokuapp.com/api.json?api_key=aeb2215ccc9879117e28c30c9131e6db';
	$.ajax({
		url: apiUrl,
		method: 'GET',
		dataType: 'jsonp'
	}).then(function(res){
		goOutside.res = res.places;
		//Use .map from underscore to create a NEW array
		//Of just the names of the states.
		var places = _.map(res.places, function(item) {
			return item.state;
		});
		//Use .uniq from underscore to find ONLY the unique names in the list.
		places = _.uniq(places).sort();
		$.each(places, function(i, value) {
			//If the value is anything other than undefined or null
			//Add it to the list
			if(value) {
				var option = $('<option>').val(value).text(value);
				$('select#choose').append(option);
				$("div.popUp").addClass("show");
			}
		});
		goOutside.compare();
	});
};

//This method stores the value of the activity when radio button is clicked. Runs test method. Adds to map.
goOutside.init = function () {
	$("input[type=radio]").on('click', function(e){
		goOutside.getActivity = $(this).val();
		goOutside.test();
		goOutside.addToMap();
	});	
};
//This method compares the activity logged and stated logged and finds the data that matches both.
goOutside.compare = function(){
	$('#choose').on('change', function(){
		goOutside.state = $(this).val();
		goOutside.responses = [];
		$.each(goOutside.res, function(i, value) {
			//If the activity is found in the state
			if (value.state === goOutside.state && value.activities.length > 0 && value.activities[0].activity_type_name === goOutside.getActivity) {
				console.log(value);
				goOutside.responses.push(value);
				goOutside.display(goOutside.responses);
			}
		});
		console.log(goOutside.responses);
	});
};

//Put the data on the map 
goOutside.addToMap = function(){
	$.each(goOutside.responses, function(i, value){
		if (value.lat !== null && value.lon !== null) {
			console.log('inside map');
			console.log (value);
			L.marker([value.lat,value.lon],
				{icon: goOutside.icon}).bindPopup().addTo(goOutside.map);
		}
	});
};

//This method displays the pieces on the page
goOutside.display = function(trails){
	$.each(trails, function(i, value){
		console.log('inside display');
		console.log(value);
		$("div.results2").addClass("show");
		var park = $('<h2>').addClass('parkNameLink').text(value.name);
		var city = $('<p>').addClass('city').text(value.city);
		var state = $('<p>').addClass('state').text(value.state);
		var desc = $('<p>').addClass('description').text(value.description);
		var parkContainer = $('<div>').addClass('container').append(park, city, state, desc)
		$('#results').append(parkContainer);
		$('html, body').animate({
            scrollTop: $("#results").offset().top}, 2000);
	});
};

//Document ready. Runs everything once it's ready. 
$(document).ready(function(){
  goOutside.init();
});

