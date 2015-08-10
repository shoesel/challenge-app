angular
.module("chApp")
.directive("mapContainer", [
	"PlatformService",
	"mapProxy",
	"MapFactory",
	"$window",
function(
	PlatformService,
	mapProxy,
	MapFactory,
	$window
){
	return {
		link: function(scope, elem, attr, ctrl){
			var width = elem[0].offsetWidth;
			angular.element($window).bind("resize", function(){
				var newWidth = elem[0].offsetWidth;
				if(width != newWidth){
					console.log("resizing now");
					width = newWidth;
					MapFactory.resizeMap();
				}
			});
			var defaultLayers = PlatformService.createDefaultLayers();
			mapProxy.map = new H.Map(elem[0], defaultLayers.normal.map);
			mapProxy.map.addObject(mapProxy.group);
			mapProxy.map.addObject(mapProxy.routeGroup);

			MapFactory.moveTo(mapProxy.startPos, mapProxy.zoom);

			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function(pos){
					mapProxy.startPos = {
						lng: pos.coords.longitude,
						lat: pos.coords.latitude,
					};
					MapFactory.placeMarker();
				});
			}
		}
	};
}])
;
