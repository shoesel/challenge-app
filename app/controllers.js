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
.controller("RouterController", [
	"$scope", 
	"waypoints",
	"mapProxy",
	"RouterParameterFactory",
	"$http",
function(
	$scope,
	waypoints,
	mapProxy,
	RouterParameterFactory,
	$http
){
	$scope.list = waypoints.list;

	$scope.$watch(function(){
		return waypoints.list;
	}, function(){
		if(mapProxy.routeGroup){
			mapProxy.routeGroup.removeAll();
			delete mapProxy.routeGroup;
		}
		if($scope.list.length > 1){
			if(!mapProxy.router){
				mapProxy.router = mapProxy.platform.getRoutingService();
			}
			var params = RouterParameterFactory.getCarRoute(waypoints.list),
				reject = function(){

				},
				resolve = function(result){
					 var route,
						routeShape,
						startPoint,
						endPoint,
						strip;

					if(result.response.route){
						route = result.response.route[0];
						routeShape = route.shape;
						strip = new H.geo.Strip();
						routeShape.forEach(function(point) {
							var parts = point.split(',');
							strip.pushLatLngAlt(parts[0], parts[1]);
						});
						var routeLine = new H.map.Polyline(strip, {
								style: { strokeColor: 'blue', lineWidth: 10 }
							}),
							group = new H.map.Group({
								objects: [routeLine]
							});
						mapProxy.routeGroup = group;
						mapProxy.map.addObject(group);
						mapProxy.map.setViewBounds(routeLine.getBounds(), true);
					}
				};
			//mapProxy.router.calculateRoute(param, resolve, reject);

			$http.get("app/route.sample.json").then(function(resp){
				resolve(resp.data);
			});
		} else {
			
		}
	}, true);		
}])
;
