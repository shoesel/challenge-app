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
}]);
