angular
.module("chApp", [
	"ngRoute", 
	"ngAnimate"
])
.value("mapProxy", {
	map: undefined,
	routeGroup: new H.map.Group(),
	group: new H.map.Group(),
	startPos: {
		lng: 13.4,
		lat: 52.51
	},
	currentPos: undefined,
	zoom: 15
})
.value("lang", {
	"de": {
		"queryPlaceHolder": "Ort oder Adresse",
		"resultError": "Ups, das hätte nicht passieren sollen"
	},
	"en": {
		"queryPlaceHolder": "Place or address",
		"resultError": "Argh, that should not have happened"
	}
})
.value("waypoints", {
	list: []
})
.constant("APP_ID", "K8Vpg17foNbs5R8PBNj0")
.constant("APP_CODE", "kmjqZuHcHrJ6wUGDM4PZ-w")
;
