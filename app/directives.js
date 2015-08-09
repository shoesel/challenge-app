angular
.module("chApp")
.directive("mapContainer", [
	"PlatformService",
	"mapProxy", 
	"MapFactory", 
function(
	PlatformService,
	mapProxy, 
	MapFactory
){
	return {
		link: function(scope, elem, attr, ctrl){
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
