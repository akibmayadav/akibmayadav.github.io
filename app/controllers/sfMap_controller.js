var sfmuniapp = angular.module('sfMap',[]);

/***************************  Controller Starts ***************************/
sfmuniapp.controller('sfMapController',function sfMapController($q,$scope,$http,$element){

	
	$scope.projection = null;
	$scope.current_time =null;
	$scope.vehicledata=null;
	$scope.vehicletag='L';
	
	
	d3.json('assets/data/sfmaps/neighborhoods.json',function(err,data){
					var width = 2*window.innerWidth/3;
					var height = 2*window.innerWidth/3;
					var margin = 20;
					projection = d3.geoAlbersUsa() 
				   			.fitExtent([[margin,margin],[width-margin,height-margin]],data) ; 
					$scope.$apply(function(){
						$scope.projection = projection;
					});

			});

	// $scope.getMuniData = call_current_api();
	// $scope.xml_data=null;
	// var cur_loc_url = "http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=sf-muni&r="+$scope.vehicletag+"&t=0";

	



	// Setting Up Current Clock
	setInterval(function(){
		var d = new Date();
		$scope.current_time = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
		$scope.$apply();
	},1000);

	
	// Getting Vehicle Data
	function call_current_api()
	{
	var cur_loc_url = "http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=sf-muni&r="+$scope.vehicletag+"&t=0";
	d3.xml(cur_loc_url,function(err,data){
		$scope.vehicledata=data;
		console.log((data))
		$scope.$apply();
	})
	}

	call_current_api();
	// setInterval(function(){
	// 	call_current_api();
	// },15000)


	var width = 2*window.innerWidth/3;
	var height = 2*window.innerWidth/3;
	var margin = 20;

	$scope.mapsvg = d3.select($element[0])
					.append("svg")
					.attr("class","Main_Map_bg")
					.attr('width',width)
					.attr('height',height);
});

/***************************  Controller Ends ***************************/