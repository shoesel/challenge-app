angular
.module("chApp")
.config([
	'$routeProvider',
function(
	$routeProvider
){
	$routeProvider
		.when('/', {
			templateUrl: '../app/templates/app.html'
		})
		.otherwise({
			redirectTo: '/'
		});
}])
;
