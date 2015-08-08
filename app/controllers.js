angular
.module("chApp")
.controller("AppController", [
	"$scope", 
	"lang",
	"$http",
	"mapProxy",
	"PlacesUrlFactory",
function(
	$scope,
	lang,
	$http,
	mapProxy,
	PlacesUrlFactory
){
	var browserLang = navigator.language || navigator.userLanguage || "en",
		langObject = lang[browserLang];
	$scope.lang = langObject;
	$scope.ready = false;

	$scope.$watch("mapProxy", function(){
		if(mapProxy.map){
			$scope.ready = true;
		}
	});

	$scope.fetchPlaces = function(){
		var loc = mapProxy.map.getCenter();
		$http.get(PlacesUrlFactory.getExploreUrl(loc, this.search, true))
			.then(function(response){
				$scope.places = response.data.results.items;
			});
	};

	$scope.putMarker = function(){
		mapProxy.group.removeAll();
		mapProxy.group.addObject(new H.map.Marker(this.place.position));
	};

	$scope.addToList = function(){

	};
}]);
