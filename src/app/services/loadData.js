angular.module('services', [])
    .factory('loadData', function ($http, $q) {
        var oauthSignature = require('oauth-signature');
        var searchIndex = 0;

        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        }

        return {
            "fetchYelp": function (loc, term) {
                var defered = $q.defer();
                var method = 'GET';
                var url = 'http://api.yelp.com/v2/search';
                var params = {
                    callback: 'angular.callbacks._' + searchIndex,
                    location: loc,
                    oauth_consumer_key: 'hyIQVkkGLREDsZobyPp5dQ', //Consumer Key
                    oauth_token: 'PCPmAjNSEpcZ4T7TFaQ3VKj8-nhhRhWJ', //Token
                    oauth_signature_method: "HMAC-SHA1",
                    oauth_timestamp: new Date().getTime(),
                    oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                    term: term
                };
                var consumerSecret = 'UgKdpO46BHlEOT-3K3MIPilF-Ro'; //Consumer Secret
                var tokenSecret = 'uF-cSlKj9usvzCIjSeVzwR2OcS8'; //Token Secret
                params.oauth_signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {encodeSignature: false});
                $http.jsonp(url, {params: params})
                    .success(function (data) {
                        defered.resolve(data);
                    })
                    .catch(function (response) {
                        defered.resolve(response.status);
                    });
                searchIndex++;
                return defered.promise;
            },
            "fetchFourSquare": function (loc, term) {
                var defered = $q.defer();
                $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + loc + '&key=AIzaSyDfW4s3roB4dkmE-9qs5l5jOedyStGmL6Y')
                    .success(function (dataFourSquare) {
                        var lat = dataFourSquare.results[0].geometry.location.lat;
                        var lng = dataFourSquare.results[0].geometry.location.lng;
                        $http.get('https://api.foursquare.com/v2/venues/search?ll=' + lat + ',' + lng + '&oauth_token=KV1IN4HPNDWD1Y5IFWZG3OF1BTK5X5MKAVUWEAB33RDAJJIO&v=20160831&query=' + term)
                            .success(function (data) {
                                defered.resolve(data);
                            })
                            .catch(function (response) {
                                defered.resolve(response.status);
                            });
                    });
                return defered.promise;
            }
        };
    });
