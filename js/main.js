var basic_choropleth = new Datamap({
  element: document.getElementById("worldMap"),
  projection: 'mercator',
  fills: {
    defaultFill: "#ABDDA4"
  }
});

var colors = d3.scale.category10();
var countries = Datamap.prototype.worldTopo.objects.world.geometries;

function randomCountry() {
	return countries[Math.floor(Math.random()*countries.length)].properties.iso;
}

setInterval(function() {
  basic_choropleth.updateChoropleth({
	  [randomCountry()] : colors(Math.random() * 100)
	});
}, 2000);