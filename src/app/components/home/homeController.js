require('angular');
angular.module('myWWW.home', ['services'])
.controller('homeController',function($scope,loadData){
	var hotels = '';
	var yelp = loadData.retrieveYelp('manhattan');
	var fourSquare = loadData.retrieveFourSquare('pune');
	$scope.output  = 'Click the button';

	yelp.then(function(data){
		console.log('yelp',data.businesses);
	});


	fourSquare.then(function(data){
		hotels = data.response.venues;
		console.log('4Sq',hotels);		
	});

	
	function loadMap() {			
	        var mapOptions = {
	           center:new google.maps.LatLng(18.31, 73.85), zoom:6,
	           mapTypeId:google.maps.MapTypeId.ROADMAP
	        };			
	        var map = new google.maps.Map(document.getElementById("sample"),mapOptions);

	        for(var i=0;i<hotels.length;i++){
	        	var name = hotels[i].name;
	        	var marker = new google.maps.Marker({
		            position: new google.maps.LatLng(hotels[i].location.lat, hotels[i].location.lng),
		            map: map,
		            animation:google.maps.Animation.Drop
	       		});

	       		var infowindow = new google.maps.InfoWindow({
               		content:name
            	});	

            	google.maps.event.addListener(marker, 'click', function() {
               		infowindow.open(map,marker);
           		 });		          
          	}       
     	}

     	loadMap();
	
	$scope.getLocation = function() {
		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(showPosition, showError);
		    } else {
		       $scope.output= "Geolocation is not supported by this browser.";
		    }
		}

		function showPosition(position) {
		    var latlon = position.coords.latitude + "," + position.coords.longitude;

		    var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="
		    +latlon+"&zoom=14&size=400x300&sensor=false";
		    //document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
		}

		function showError(error) {
		    switch(error.code) {
		        case error.PERMISSION_DENIED:
		            $scope.output = "User denied the request for Geolocation."
		            break;
		        case error.POSITION_UNAVAILABLE:
		            $scope.output= "Location information is unavailable."
		            break;
		        case error.TIMEOUT:
		            $scope.output= "The request to get user location timed out."
		            break;
		        case error.UNKNOWN_ERROR:
		            $scope.output = "An unknown error occurred."
		            break;
		    }
		}
	
});