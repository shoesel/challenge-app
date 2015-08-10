angular
.module("chApp")
.factory("UrlFactory", [
	"APP_ID",
	"APP_CODE",
	"mapProxy",
function(
	app_id,
	app_code,
	mapProxy
){
	var placesBaseUrl = "http://places.cit.api.here.com/places/v1/",
		searchBaseUrl = "http://geocoder.api.here.com/6.2/",
		routeBaseUrl = "https://www.here.com/directions/";
	return {
		getExploreUrl : function(pos, q){
			return [placesBaseUrl + "discover/explore?app_id=" + app_id,
				"app_code=" + app_code,
				"at=" + pos.lat + "," + pos.lng,
				"q=" + q].join("&");
		},
		getSearchUrl: function(q){
			return [searchBaseUrl + "geocode.json?app_id=" + app_id,
				"app_code=" + app_code,
				"gen=8",
				"searchtext=" + q
				].join("&");
		},
		getRouteUrl: function(list, mode){
			var url = routeBaseUrl + (mode == "car" ? 
				"drive/" : mode == "pedestrian" ? 
				"walk/" : "publicTransport/");
			url += list.map(function(item){
				return item.title.replace(/\s+/g,"-") + ":" + item.position[0] + "," + item.position[1];
			}).join("/");
			var centerPos = mapProxy.map.getCenter();
			url += "?map=" + centerPos.lat + "," + centerPos.lng + "," + mapProxy.map.getZoom();
			var baseLayer = mapProxy.map.getBaseLayer();
			url += ",normal";
			return url;
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

	var resizeMap = function(){
		mapProxy.map.getViewPort().resize();
		var bounds = mapProxy.routeGroup.getBounds() || mapProxy.group.getBounds();
		if(bounds){
			Queue.add(function(resolve) {
				mapProxy.map.setViewBounds(bounds, true);
				mapProxy.map.addEventListener("mapviewchangeend", function(){
					this.removeEventListener("mapviewchangeend");
					resolve();
				});
			});
		}
	};

	return {
		placeMarker: placeMarker,
		moveTo: moveTo,
		resizeMap: resizeMap
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

		var startIcon = new H.map.DomIcon('<i class="fa start fa-flag-o"></i>'),
			startPoint = route.waypoint[0].mappedPosition,
			startMarker = new H.map.DomMarker({
				lat: startPoint.latitude,
				lng: startPoint.longitude
			}, {icon: startIcon}),
			domIcon = new H.map.DomIcon('<i class="fa end fa-flag-checkered"></i>'),
			endPoint = route.waypoint[route.waypoint.length-1].mappedPosition,
			endMarker = new H.map.DomMarker({
				lat: endPoint.latitude,
				lng: endPoint.longitude
			}, {icon: domIcon});

		mapProxy.routeGroup.addObjects([startMarker, endMarker]);

		mapProxy.map.setBaseLayer(mapProxy.layers.normal.traffic);

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
		mapProxy.map.setBaseLayer(mapProxy.layers.normal.map);
	};

	return {
		drawRoute: drawRoute,
		clearRoute: clearRoute
	};
}])
;
