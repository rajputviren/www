function homeController($scope, loadData, $http) {
    var _ = require('lodash');
    var yelp, map, fourSquare, geoLat, geoLng, infowindow, venueImage, yelpData, fourSquareData;
    var image;
    var imageSize = '120x120';

    loadMap(18.31, 73.85, 6); //Location over India by default.
    $('#loader').hide();

    $scope.showResult = function () {
        $scope.output = [];
        if (($scope.area !== undefined) && ($scope.term !== undefined)) {
            $('#loader').show();
            $scope.area = $scope.area.split(',')[0];
            yelp = loadData.fetchYelp($scope.area, $scope.term);
            fourSquare = loadData.fetchFourSquare($scope.area, $scope.term);
            yelp.then(function (yData) {
                yelpData = yData.businesses;
                fourSquare.then(function (fData) {
                    fourSquareData = fData.response.venues;
                    if (fourSquareData.length < 1) {
                        return;             // No result found.
                    }
                    var combinedData = _.merge(yelpData, fourSquareData);
                    if (yData == 404) combinedData = fourSquareData;
                    for (var i = 0; i < combinedData.length; i++) {
                        image = combinedData[i].image_url !== undefined ? combinedData[i].image_url : getImageFourSquare(fourSquareData[i].id);
                        var contact = combinedData[i].contact ? combinedData[i].contact : 'Not available';
                        var twitter = combinedData[i].contact.twitter ? combinedData[i].contact.twitter : 'Not available';
                        var url = combinedData[i].url? combinedData[i].url : 'Not available';
                        var rating = combinedData[i].rating ? combinedData[i].rating : 'Not available';
                        $scope.output.push({
                            id: combinedData[i].id,
                            name: combinedData[i].name,
                            location: combinedData[i].location,
                            contact: contact,
                            twitter: twitter,
                            url: url,
                            rating: rating,
                            image: image
                        });
                    }
                    if ($scope.output.length > 25) $scope.output.length = 25;
                    loadMap($scope.output[0].location.lat, $scope.output[0].location.lng, 14);
                    $('.preloader-wrapper').hide();
                    addMarker();
                });
            });
        }
        $scope.area = $scope.term = '';                     //Reinitialise inputbox text for next click.
    };

    function getImageFourSquare(id) {
        $http.get('https://api.foursquare.com/v2/venues/' + id + '/photos?oauth_token=UYJI4JL3SA3GCJXYKPOJFK3NWEAIOPRBK1AMS4XBQTFP2U3F&v=20160919')
            .success(function (data) {
                var imageData = data.response.photos.items[0];
                return image = imageData ? imageData.prefix + imageSize + imageData.suffix : '';
            });
    }

    function addMarker() {
        for (var i = 0; i < $scope.output.length; i++) {
            var name = $scope.output[i].name;

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.output[i].location.lat, $scope.output[i].location.lng),
                map: map,
                animation: google.maps.Animation.DROP
            });

            infowindow = new google.maps.InfoWindow({
                content: name
            });

            google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
                return function () {
                    infowindow.setContent($scope.output[i].name);
                    infowindow.open(map, marker);
                };
            })(marker, i));

            google.maps.event.addListener(marker, 'mouseout', (function (marker, i) {
                return function () {
                    infowindow.close(map, marker);
                };
            })(marker, i));
        }
    }

    function loadMap(lat, lng, zoom) {
        var mapOptions = {
            center: new google.maps.LatLng(lat, lng), zoom: zoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
    }

    $scope.getLocation = function () {
        $('#locality').focus();
        navigator.geolocation.getCurrentPosition(function (location) {
            geoLat = location.coords.latitude;
            geoLng = location.coords.longitude;
            getAddress(geoLat, geoLng);
            loadMap(geoLat, geoLng, 9);
        });
    };

    function getAddress(lat, lng) {
        $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyDfW4s3roB4dkmE-9qs5l5jOedyStGmL6Y')
            .success(function (data) {
                var address_components = data.results[0].address_components;
                $scope.area = address_components[5].long_name + ', ' + address_components[6].long_name + ', ' + address_components[7].long_name;
            });
    }
}
module.exports = homeController;