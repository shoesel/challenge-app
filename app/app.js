/*jslint node: true */
/*jslint nomen: true */
/*global angular,H*/
"use strict";

angular.module("chApp", ["ngRoute"])
.value("mapProxy", {
	"app_id": "K8Vpg17foNbs5R8PBNj0",
	"app_code": "kmjqZuHcHrJ6wUGDM4PZ-w",
	"platform": undefined,
	"map": undefined
})
.value("lang", {
	"de": {
		"queryPlaceHolder": "Ort oder Adresse"
	},
	"en": {
		"queryPlaceHolder": "Place or address"	
	}
})
.value("waypoints", {
	list: []
})
;
