angular
.module("chApp")
.directive("mapContainer", [
	"PlatformService",
	"mapProxy",
	"MapFactory",
	"$window",
	"$timeout",
function(
	PlatformService,
	mapProxy,
	MapFactory,
	$window,
	$timeout
){
	return {
		link: function(scope, elem, attr, ctrl){
			var width = elem[0].offsetWidth,
				resizeDelaying = false,
				resizeFn = function(){
					var newWidth = elem[0].offsetWidth;
					if(width != newWidth){
						width = newWidth;
						MapFactory.resizeMap();
					}
				};
			
			angular.element($window).bind("resize", function(){
				if(!resizeDelaying){
					resizeDelaying = true;
					$timeout(function(){
						resizeDelaying = false;
						resizeFn();
					}, 100);
					resizeFn();
				}
			});
			
			mapProxy.layers = PlatformService.createDefaultLayers();
			mapProxy.map = new H.Map(elem[0], mapProxy.layers.normal.map);
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
