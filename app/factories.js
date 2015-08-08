angular
.module("chApp")
.factory("PlacesUrlFactory", ["mapProxy", function(mapProxy){
	var baseUrl = "http://places.cit.api.here.com/places/v1/";
	return {
		getExploreUrl : function(pos, q, debug){
			return debug ? "app/places.sample.json" : [
				baseUrl + "discover/explore?app_id=" + mapProxy.app_id,
				"app_code=" + mapProxy.app_code,
				"at=" + pos.lat + "," + pos.lng,
				"q=" + q].join("&");
		}
	};
}])
.factory("MarkerFactory", ["mapProxy", function(mapProxy){
	function placeMarker(pos){
		var myPos = pos || mapProxy.startPos,
			marker = new H.map.Marker(myPos),
			group = new H.map.Group({
				objects: [marker]
			});

		if(mapProxy.group){
			mapProxy.group.removeAll();
		}
		if(myPos != mapProxy.startPos){
			mapProxy.group = group;

			mapProxy.map.addObject(group);
		}
		
		mapProxy.map.setCenter(myPos, true);

		mapProxy.map.addEventListener("mapviewchangeend", function(){
			this.setZoom(mapProxy.zoom, true);
			this.removeEventListener("mapviewchangeend");
		});
	}
	return {
		placeMarker: placeMarker
	};
}])
.factory("RouterParameterFactory", [function(){
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
function(
	mapProxy
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
				}),
				group = new H.map.Group({
					objects: [routeLine]
				});
			mapProxy.routeGroup = group;
			mapProxy.map.addObject(group);
			mapProxy.map.setViewBounds(routeLine.getBounds(), true);
	};

	return {
		drawRoute: drawRoute
	};
}])
;
