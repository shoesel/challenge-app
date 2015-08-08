angular
.module("chApp")
.controller("AppController", [
	"$scope", 
	"lang",
	"$http",
	"mapProxy",
	"PlacesUrlFactory",
	"waypoints",
	"MarkerFactory",
	function(
	$scope,
	lang,
	$http,
	mapProxy,
	PlacesUrlFactory,
	waypoints,
	MarkerFactory
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
		MarkerFactory.placeMarker();
	};

	$scope.putMarker = function(){
		var pos = {
			lat: this.place.position[0],
			lng: this.place.position[1]
		};
		MarkerFactory.placeMarker(pos);
	};

	$scope.addToList = function(){
		waypoints.list.push(this.place);
		$scope.places = [];
		$scope.search = "";
		mapProxy.group.removeAll();
	};
}])
.controller("ListController", [
	"$scope",
	"waypoints",
	function(
	$scope,
	waypoints
){	
	$scope.list = waypoints.list;

	$scope.removeFromList = function(index){
		$scope.list.splice(index, 1);
	};

	$scope.moveInList = function(newIndex, item){
		if(newIndex>-1 && newIndex<$scope.list.length){
			$scope.removeFromList($scope.list.indexOf(item));
			$scope.list.splice(newIndex, 0, item);
		}
	};

}])
;
