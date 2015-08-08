describe("mapContainer", function(){
	var platform, map;

	beforeEach(function(){
		platform = {createDefaultLayers: function(){return {normal:{map: {}}};}};
		spyOn(window.H.service, "Platform").andReturn(platform);
		
		map = {setCenter: function(){}};
		spyOn(window.H, "Map").andReturn(map);
		spyOn(map, "setCenter");
	});

	afterEach(inject(function(mapProxy){
		delete mapProxy.map;
		delete mapProxy.platform;
	}));

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
		expect(map.setCenter).toHaveBeenCalledWith(jasmine.any(Object), true);
	}));

	describe("with geolocation", function(){
		var pos = {
			coords: {
					longitude: 10,
					latitude: 20
				}
			},
			group = { addObject: function(){}, removeAll: function(){}};

		beforeEach(function(){
			navigator.geolocation = {getCurrentPosition: function(){}};
			spyOn(navigator.geolocation, "getCurrentPosition").andCallFake(function(cb){
				spyOn(map, "addObject");
				cb(pos);
			});

			spyOn(window.H.map, "Marker");
			spyOn(window.H.map, "Group").andReturn(group);

			map.addObject = function(){};
			map.addEventListener = function(){};
			map.removeEventListener = function(){};
			map.setZoom = function(){};
			spyOn(map, "setZoom");
			spyOn(map, "removeEventListener");
		});

		it("should add a marker on location", inject(function($rootScope, $compile, mapProxy){
			var element = $compile('<div map-container></div>')($rootScope);
			$rootScope.$digest();
			expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
			expect(window.H.map.Marker).toHaveBeenCalledWith({lng: 10, lat: 20});
			expect(window.H.map.Group).toHaveBeenCalledWith(jasmine.any(Object));
			expect(map.addObject).toHaveBeenCalled();
		}));

		it("should queue centering and zooming to location", inject(function($rootScope, $compile, mapProxy){
			var eventHandler;
			spyOn(map, "addEventListener").andCallFake(function(name, cb){
				eventHandler = cb;
			});
			var element = $compile('<div map-container></div>')($rootScope);
			$rootScope.$digest();
			expect(map.addEventListener).toHaveBeenCalledWith("mapviewchangeend", jasmine.any(Function));
			expect(map.setCenter).toHaveBeenCalledWith({lng: 10, lat:20}, true);
			expect(map.setZoom).not.toHaveBeenCalled();
			eventHandler.apply(map);
			expect(map.setZoom).toHaveBeenCalled();
			expect(map.removeEventListener).toHaveBeenCalled();
		}));
	});
});
