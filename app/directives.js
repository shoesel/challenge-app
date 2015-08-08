angular
.module("chApp")
.directive("mapContainer", [
	"mapProxy",
	"MarkerFactory",
function(
	mapProxy,
	MarkerFactory
){
	return {
		link: function(scope, elem, attr, ctrl){
			if(!mapProxy.platform){
				try{
					mapProxy.platform = new H.service.Platform({
						'app_id': mapProxy.app_id,
						'app_code': mapProxy.app_code
					});
				} catch(ex){}
				if(!mapProxy.platform){
					elem.append("Error during initialization!");
					return;
				}
			}
			var defaultLayers = mapProxy.platform.createDefaultLayers(),
				startPos = {
					lng: 13.4,
					lat: 52.51
				};
			mapProxy.startPos = startPos;
			mapProxy.zoom = 15;
			mapProxy.map = new H.Map(elem[0], defaultLayers.normal.map, {zoom: 10});
			mapProxy.map.setCenter(startPos, true);
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function(pos){
					MarkerFactory.placeMarker({
						lng: pos.coords.longitude,
						lat: pos.coords.latitude,
					});
				});
			}
		}
	};
}])
;
