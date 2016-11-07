
var githubMap = new Datamap({
  element: document.getElementById("worldMap"),
  projection: 'mercator',
  fills: {
    defaultFill: "#ABDDA4"
  }
});

var colors = d3.scale.category10();
var countries = Datamap.prototype.worldTopo.objects.world.geometries;
var countriesRepacked = [], timer = 0;
$.each(countries, function(index, value){
	countriesRepacked.push({id: value.id, name: value.properties.name});
});

githubCountries();
setInterval(function(){
	$('.avatars').html('');
	githubCountries();
}, 60000);