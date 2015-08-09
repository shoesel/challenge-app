angular
.module("chApp")
.service("PlatformService", [
	"APP_ID", 
	"APP_CODE",
	"mapProxy",
function(
	app_id, 
	app_code,
	mapProxy
){
	return new H.service.Platform({
		'app_id': app_id,
		'app_code': app_code
	});
}])
.service("QueueService", function(){
	var arr = [],
		current = null,
		add = function(def){
			arr.push(def);
			if(!current){
				start();
			}
			return this;
		},
		start = function(){
			current = arr.shift();
			if(current){
				current(start);
			}
		};
	return {
		add: add
	};
})
;
