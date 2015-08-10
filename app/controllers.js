angular
.module("chApp")
.controller("AppController", [
	"$scope",
	"lang",
	"$http",
	"mapProxy",
	"UrlFactory",
	"waypoints",
	"MapFactory",
	"$q",
function(
	$scope,
	lang,
	$http,
	mapProxy,
	UrlFactory,
	waypoints,
	MapFactory,
	$q
){
	var browserLang = navigator.language || navigator.userLanguage || "en",
		langShort = browserLang.split("-")[0].toLowerCase(),
		langObject = lang[langShort] || lang.en;
	$scope.langCode = langShort;
	$scope.lang = langObject;
	$scope.places = [];
	$scope.error = false;

	$scope.fetchPlaces = function(){
		if(this.search){
			var loc = mapProxy.map.getCenter(),
				places,
				addresses;
			$q.all([
				$http.get(UrlFactory.getExploreUrl(loc, this.search)),
				$http.get(UrlFactory.getSearchUrl(this.search.replace(/\s+/g,"+")))
			]).then(function(responses){
				$scope.error = false;
				$scope.emptyPlaces();
				if(responses[0] &&
					responses[0].data &&
					responses[0].data.results &&
					responses[0].data.results.items
				){
					Array.prototype.push.apply($scope.places, resps);
				}
				if(responses[1] &&
					responses[1].data &&
					responses[1].data.Response &&
					responses[1].data.Response.View &&
					responses[1].data.Response.View[0] &&
					responses[1].data.Response.View[0].Result
				){
					var resps = responses[1].data.Response.View[0].Result.map(function(item){
						return {
							title: item.Location.Address.Label,
							position: [
								item.Location.DisplayPosition.Latitude,
								item.Location.DisplayPosition.Longitude
							]
						};
					});
					Array.prototype.push.apply($scope.places, resps);
				}
			}, function(){
				$scope.error = true;
			});
		}
	};

	$scope.emptyPlaces = function(){
		$scope.places.splice(0, $scope.places.length);
	};

	$scope.clearPlaces = function(){
		$scope.emptyPlaces();
		$scope.search = "";
		MapFactory.placeMarker();
	};

	$scope.putMarker = function(){
		var pos = {
			lat: this.place.position[0],
			lng: this.place.position[1]
		};
		MapFactory.placeMarker(pos);
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

	$scope.removeFromList = function(item){
		var index = this.list.indexOf(item);
		if(index >- 1){
			this.list.splice(index, 1);
		}
	};

	$scope.moveInList = function(item, offset){
		var index = this.list.indexOf(item),
			newIndex = index + offset;
		if(newIndex >-1 && newIndex < this.list.length){
			this.removeFromList(item);
			this.list.splice(newIndex, 0, item);
		}
	};

	$scope.moveBefore = function (index, item, evt) {
		this.removeFromList(item);
		this.list.splice(index, 0, item);
	};

}])
.controller("RouterController", [
	"$scope",
	"waypoints",
	"mapProxy",
	"RouterParameterFactory",
	"$http",
	"RouterFactory",
	"PlatformService",
	"MapFactory",
	"UrlFactory",
function(
	$scope,
	waypoints,
	mapProxy,
	RouterParameterFactory,
	$http,
	RouterFactory,
	PlatformService,
	MapFactory,
	UrlFactory
){
	$scope.list = waypoints.list;
	$scope.mode = "car";
	$scope.distance = "0";
	$scope.duration = "0";
	$scope.showLink = false;
	$scope.routeLink = "";

	$scope.formatValues = function(_distance, _duration){
		var result = [],
			distance = parseInt(_distance),
			duration = parseInt(_duration);

		var h = Math.floor(duration / 3600);
		duration -= h * 3600;
		var min = Math.floor(duration / 60);
		duration -= min * 60;
		result.push(h + "h " + min + "min " + duration + "s");

		var km = Math.floor(distance / 1000);
		distance -= km * 1000;
		result.push(km + "km " + distance + "m");
		return result;
	};

	$scope.toggleMode = function(mode){
		this.mode = mode;
	};

	$scope.toggleLink = function(){
		$scope.showLink = !$scope.showLink;
	};

	$scope.clearList = function(){
		this.list.splice(0, $scope.list.length);
		$scope.distance = 0;
		$scope.duration = 0;
		$scope.showLink = false;
		$scope.routeLink = "";
		MapFactory.moveTo(mapProxy.startPos, mapProxy.zoom);
	};

	var handleChange = function(){
		if($scope.list.length > 1){
			if(!mapProxy.router){
				mapProxy.router = PlatformService.getRoutingService();
			}
			var params = RouterParameterFactory.getRoute(waypoints.list, $scope.mode),
				reject = function(){

				},
				resolve = function(result){
					if(result.response && result.response.route){
						var route = result.response.route[0],
							summary = route.leg.reduce(function(memo, leg){
								memo.distance += leg.summary.distance;
								memo.travelTime += leg.summary.travelTime;
							return memo;
						}, {distance:0, travelTime:0});
						$scope.distance = summary.distance;
						$scope.duration = summary.travelTime;
						RouterFactory.drawRoute(route);
						$scope.routeLink = UrlFactory.getRouteUrl($scope.list, $scope.mode);
						$scope.$apply();
					} else {
						$scope.distance = 0;
						$scope.duration = 0;
						RouterFactory.clearRoute();
						$scope.$apply();
					}
				};
			mapProxy.router.calculateRoute(params, resolve, reject);
		} else {
			$scope.distance = 0;
			$scope.duration = 0;
			$scope.showRoute = false;
			$scope.routeLink = "";
			RouterFactory.clearRoute();
		}
	};

	$scope.$watch("mode", handleChange);

	$scope.$watch(function(){
		return waypoints.list;
	}, handleChange, true);
}])
;
