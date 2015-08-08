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
	$scope.places = [];

	$scope.$watch("mapProxy", function(){
		if(mapProxy.map){
			$scope.ready = true;
		}
	});

	$scope.fetchPlaces = function(){
		var loc = mapProxy.map.getCenter();
		$http.get(PlacesUrlFactory.getExploreUrl(loc, this.search))
			.then(function(response){
				$scope.emptyPlaces();
				Array.prototype.push.apply($scope.places, response.data.results.items);
			});
	};

	$scope.emptyPlaces = function(){
		$scope.places.splice(0, $scope.places.length);
	};

	$scope.clearPlaces = function(){
		$scope.emptyPlaces();
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
.controller("RouterController", [
	"$scope", 
	"waypoints",
	"mapProxy",
	"RouterParameterFactory",
	"$http",
	"RouterFactory",
function(
	$scope,
	waypoints,
	mapProxy,
	RouterParameterFactory,
	$http,
	RouterFactory
){
	$scope.list = waypoints.list;
	$scope.mode = "car";
	$scope.distance = "0m";
	$scope.duration = "0s";

	$scope.formatValues = function(distance, duration){
		console.log(distance, duration);
		var h = Math.floor(duration / 3600);
		duration -= h * 3600;
		var min = Math.floor(duration / 60);
		duration -= min * 60;
		$scope.duration = h + "h " + min + "min " + duration + "s";

		var km = Math.floor(distance / 1000);
		distance -= km * 1000;
		$scope.distance = km + "km " + distance + "m";

		$scope.$apply();

		console.log($scope.mode);
	};

	$scope.toggleMode = function(mode){
		$scope.mode = mode;
	};

	$scope.clearList = function(){
		$scope.list.splice(0, $scope.list.length);
	};

	var handleChange = function(){
		if(mapProxy.routeGroup){
			mapProxy.routeGroup.removeAll();
			delete mapProxy.routeGroup;
		}
		if($scope.list.length > 1){
			if(!mapProxy.router){
				mapProxy.router = mapProxy.platform.getRoutingService();
			}
			var params = RouterParameterFactory.getRoute(waypoints.list, $scope.mode),
				reject = function(){

				},
				resolve = function(result){
					if(result.response && result.response.route){
						var route = result.response.route[0],
							summary = route.leg[0].summary;
						$scope.formatValues(summary.distance, summary.travelTime);
						RouterFactory.drawRoute(route);
					}
				};
			mapProxy.router.calculateRoute(params, resolve, reject);
		} else {
			
		}
	};

	$scope.$watch("mode", handleChange);

	$scope.$watch(function(){
		return waypoints.list;
	}, handleChange, true);
}])
;
