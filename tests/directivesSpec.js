describe("mapContainer", function(){
	var platform, map;

	beforeEach(function(){
		window.H = {service:{Platform: function(){}}, Map: function(){}};
		platform = {createDefaultLayers: function(){return {normal:{map: {}}};}};
		spyOn(window.H.service, "Platform").andReturn(platform);
		map = {};
		spyOn(window.H, "Map").andReturn(map);
	});

	beforeEach(module("chApp"));

	it("should initialize the platform", inject(function($rootScope, $compile, mapProxy){
		var element = $compile('<div map-container></div>')($rootScope);
		$rootScope.$digest();
		expect(window.H.service.Platform).toHaveBeenCalled();
		expect(mapProxy.platform).toBe(platform);
	}));

	it("should not initialize the platform twice", inject(function($rootScope, $compile, mapProxy){
		mapProxy.platform = platform;
		var element = $compile('<div map-container></div>')($rootScope);
		$rootScope.$digest();
		expect(window.H.service.Platform).not.toHaveBeenCalled();
		expect(mapProxy.platform).toBe(platform);
	}));	

	it("should initialize the map", inject(function($rootScope, $compile, mapProxy){
		var element = $compile('<div map-container></div>')($rootScope);
		$rootScope.$digest();
		expect(window.H.Map).toHaveBeenCalled();
		expect(mapProxy.map).toBe(map);
	}));
});
