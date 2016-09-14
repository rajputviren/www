require('angular');
var $ = require('jQuery');
angular.module('myWWW.home', ['services'])
    .controller('homeController', function ($scope, loadData, $http, $stateParams, $state) {
        loadMap(18.31, 73.85, 6); //Pune by default location

        var yelp;
        var map;
        var fourSquare;
        var geoLat;
        var geoLng;
        var yelpData, fourSquareData;

        $scope.showResult = function () {
            $scope.queryData = [];
            $stateParams.area = $scope.area;

            if (($scope.area !== undefined) && ($scope.term !== undefined)) {
                yelp = loadData.retrieveYelp($scope.area, $scope.term);
                fourSquare = loadData.retrieveFourSquare($scope.area, $scope.term);

                yelp.then(function (yData) {
                    yelpData = yData.businesses;
                    fourSquare.then(function (fData) {
                        fourSquareData = fData.response.venues;
                        if (yData == 404) yelpData = fourSquareData;
                        var length = (yelpData) ? yelpData.length : fourSquareData.length;
                        for (var i = 0; i < length; i++) {
                            var image = yelpData ? yelpData[i].image_url : undefined;
                            $scope.queryData.push({
                                name: yelpData[i].name,
                                location: fourSquareData[i].location,
                                contact: fourSquareData[i].contact,
                                rating: yelpData[i].rating,
                                image: image
                            });
                        }
                        loadMap($scope.queryData[0].location.lat, $scope.queryData[0].location.lng, 16);
                        addMarker();
                        console.log($scope.queryData)
                    });
                });
            }
            $scope.area = $scope.term = '';
        };


        function addMarker() {
            for (var i = 0; i < $scope.queryData.length; i++) {
                var name = $scope.queryData[i].name;

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng($scope.queryData[i].location.lat, $scope.queryData[i].location.lng),
                    map: map,
                    animation: google.maps.Animation.DROP
                });

                var infowindow = new google.maps.InfoWindow({
                    content: name
                });

                google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
                    return function () {
                        infowindow.setContent($scope.queryData[i].name);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            }
        }

        function loadMap(lat, lng, zoom) {
            var mapOptions = {
                center: new google.maps.LatLng(lat, lng), zoom: zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
        }

        $scope.getLocation = function () {
            navigator.geolocation.getCurrentPosition(function (location) {
                geoLat = location.coords.latitude;
                geoLng = location.coords.longitude;
                getAddress(geoLat, geoLng)
            });
        };

        function getAddress(lat, lng) {
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyDfW4s3roB4dkmE-9qs5l5jOedyStGmL6Y')
                .success(function (data) {
                    alert('Your exact location is ' + data.results[0].formatted_address)
                });
        }
    });