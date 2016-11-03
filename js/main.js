
var githubMap = new Datamap({
  element: document.getElementById("worldMap"),
  projection: 'mercator',
  fills: {
    defaultFill: "#ABDDA4"
  }
});

var colors = d3.scale.category10();
var countries = Datamap.prototype.worldTopo.objects.world.geometries;
var countriesRepacked = [];
var stashResult = {};
$.each(countries, function(index, value){
	countriesRepacked.push({id: value.id, name: value.properties.name});
});

githubCountries();
setInterval(function(){
	$('.avatars').html('');
	githubCountries();
}, 60000);

	function githubCountries(){
		 $.ajax({
		 	url: "https://api.github.com/events" ,
		 	success: function(result){
		 		if(result != stashResult) {
			 		$.each(result, function(index, value){
			 			$('.avatars').css('display', 'none');
						$('.avatars').append('<a href="' + value.actor.url.replace('api.', '').replace('/users', '') + '"><img src="' + value.actor.avatar_url + '" title="' + value.actor.url.replace('api.', '').replace('/users', '') + '"/></a>');
						setTimeout(function(){
			 				$('.avatars').fadeIn(1000).css('display', 'block').fadeIn(1000);
						}, 2000);
						$.ajax({
							url: value.actor.url + "?client_id=90f2bc697417b6c1d3b9&client_secret=59bcaaa0e61b1c1943e02d9f8c41313a5edcca8f",
							success: function(result) {
								console.log(result);
								if(result.location != null) {
									$.each(countriesRepacked, function(index, value){
										if(result.location.includes(value.name)) {
											var iso = value.id;
											 githubMap.updateChoropleth({
											  [iso]: '#17becf'
											});
										}
									});
								}
							}
						});
			 		});
		 		}
			}
		});
	}