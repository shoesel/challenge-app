angular
.module("chApp")
.directive("mapContainer", [
	"mapProxy",
function(
	mapProxy
){
	return {
		link: function(scope, elem, attr, ctrl){
			if(!mapProxy.platform){
				mapProxy.platform = new H.service.Platform({
					'app_id': mapProxy.app_id,
					'app_code': mapProxy.app_code
				});
			}
			var defaultLayers = mapProxy.platform.createDefaultLayers();
			mapProxy.map = new H.Map(elem[0], defaultLayers.normal.map, {
				zoom: 10,
				center: { lng: 13.4, lat: 52.51 }
			});
		}
	};
}])
;
