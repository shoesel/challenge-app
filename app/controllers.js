angular
.module("chApp")
.controller("AppController", [
	"$scope", 
	"lang",
	"$http",
	"mapProxy",
	"PlacesUrlFactory", function(
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

	$scope.clearPlaces = function(){
		$scope.places = [];
		$scope.search = "";
		mapProxy.group.removeAll();
		var pos = mapProxy.startPos;
		mapProxy.group.addObject(new H.map.Marker(pos));
		mapProxy.map.setCenter(pos, true);
	};

	$scope.putMarker = function(){
		mapProxy.group.removeAll();
		var pos = {
			lat: this.place.position[0],
			lng: this.place.position[1]
		};
		mapProxy.group.addObject(new H.map.Marker(pos));
		mapProxy.map.setCenter(pos, true);
	};

	$scope.addToList = function(){

	};
}]);
