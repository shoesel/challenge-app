angular
.module("chApp")
.controller("AppController", [
	"$scope",
	"lang",
function(
	$scope,
	lang
){
	var browserLang = navigator.language || navigator.userLanguage || "en",
		langObject = lang[browserLang];
	$scope.lang = langObject;
}]);
