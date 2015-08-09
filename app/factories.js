angular
.module("chApp")
.factory("UrlFactory", [
	"APP_ID", 
	"APP_CODE",
function(
	app_id,
	app_code
){
	var placesBaseUrl = "http://places.cit.api.here.com/places/v1/",
		searchBaseUrl = "http://geocoder.api.here.com/6.2/";
	return {
		getExploreUrl : function(pos, q){
			return [placesBaseUrl + "discover/explore?app_id=" + app_id,
				"app_code=" + app_code,
				"at=" + pos.lat + "," + pos.lng,
				"q=" + q].join("&");
		},
		getCitySearchUrl: function(q){
			return [searchBaseUrl + "geocode.json?app_id=" + app_id,
				"app_code=" + app_code,
				"gen=8",
				"searchtext=" + q
				].join("&");
		},
		getStreetSearUrl: function(q){
			return [searchBaseUrl + "geocode.json?app_id=" + app_id,
				"app_code=" + app_code,
				"gen=8",
				"street=" + q
				].join("&");
		}
	};
}])
.factory("MapFactory", [
	"mapProxy",
	"QueueService",
	"$q",
function(
	mapProxy,
	Queue,
	$q
){
	function placeMarker(pos){
		var myPos = pos || mapProxy.startPos,
			marker = new H.map.Marker(myPos);

		mapProxy.group.removeAll();
		mapProxy.group.addObject(marker);

		this.moveTo(myPos, mapProxy.zoom);
	}

	function moveTo(pos, zoom){
		var myPos = pos || mapProxy.startPos;
		Queue.add(function(resolve){
			mapProxy.map.setCenter(myPos, true);
			mapProxy.map.addEventListener("mapviewchangeend", function(){
				this.removeEventListener("mapviewchangeend");
				resolve();
			});
		}).add(function(resolve){
			mapProxy.map.setZoom(zoom, true);
			mapProxy.map.addEventListener("mapviewchangeend", function(){
				this.removeEventListener("mapviewchangeend");
				resolve();
			});
		});
	}

	return {
		placeMarker: placeMarker,
		moveTo: moveTo
	};
}])
.factory("RouterParameterFactory", [
function(
){
	function getRoute(waypoints, mode){
		var params = {
			mode: "fastest;" + mode,
			representation: "display",
			legattributes: "summary"
		};
		if(!waypoints.length){
			return -1;
		}

		var i=0, j=0, last;
		do {
			var waypoint = waypoints[i++],
				current = "geo!" + waypoint.position[0] + "," + waypoint.position[1];
			if(last != current){
				params["waypoint" + j] = current;
				last = current;
				j++;
			}

		} while(i<waypoints.length);

		if(params.waypoint1){
			return params;
		}
		return -1;
	}
	return {
		getRoute: getRoute
	};
}]).factory("RouterFactory", [
	"mapProxy",
	"QueueService",
function(
	mapProxy,
	Queue
){
	var drawRoute = function(route){
		var routeShape = route.shape,
			strip = new H.geo.Strip();
		
		routeShape.forEach(function(point) {
			var parts = point.split(',');
			strip.pushLatLngAlt(parts[0], parts[1]);
		});
		
		var routeLine = new H.map.Polyline(strip, {
			style: { strokeColor: 'blue', lineWidth: 5 }
		});
		
		mapProxy.routeGroup.removeAll();

		mapProxy.routeGroup.addObject(routeLine);
		
		Queue.add(function(resolve){
			mapProxy.map.setViewBounds(routeLine.getBounds(), true);
			mapProxy.map.addEventListener("mapviewchangeend", function(){
				this.removeEventListener("mapviewchangeend");
				resolve();
			});
		});
	};

	var clearRoute = function(){
		mapProxy.routeGroup.removeAll();
	};

	return {
		drawRoute: drawRoute,
		clearRoute: clearRoute
	};
}])
;
