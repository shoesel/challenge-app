angular
.module("chApp")
.directive("mapContainer", ["mapProxy", function(mapProxy){
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
			mapProxy.map = new H.Map(elem[0], defaultLayers.normal.map, {zoom: 10});
			mapProxy.map.setCenter(startPos);
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function(pos){
					var myPos = {
							lng: pos.coords.longitude,
							lat: pos.coords.latitude,
						},
						marker = new H.map.Marker(myPos),
						group = new H.map.Group({
							objects: [marker]
						});

					mapProxy.map.addObject(group);
					
					mapProxy.map.setCenter(myPos, true);

					mapProxy.map.addEventListener("mapviewchangeend", function(){
						this.setZoom(15, true);
						this.removeEventListener("mapviewchangeend");
					})
					;
				});
			}
		}
	};
}])
;
