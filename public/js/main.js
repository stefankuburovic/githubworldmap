var githubMap = new Datamap({
element: document.getElementById("worldMap"),
projection: 'mercator',
fills: {
defaultFill: "#ABDDA4"
}
}),
colors = d3.scale.category10(),
countries = Datamap.prototype.worldTopo.objects.world.geometries;
var socket = io();

$('.avatars a').hover(function(){
    var countryData = $(this).attr('data-country');
    console.log(countryData);
    $.each(returnCountries(), function(index, country){
        if(countryData.includes(country.name)) {
            githubMap.updateChoropleth({
              [country]: '#000'
            });
        }
    });
});

socket.on('github', function (data) {
    if(typeof data != "undefined") {
        $.each(data, function(index, value){
            githubCountries(value);
        });
    }
});

function githubCountries(data){
    $.each(data, function(index, value){
        $.ajax({
            url: value.user_url + "?access_token=a8f0e48ea5f481c52739bc8a86a463a52299a216",
            crossDomain: true,
            success: function(result) {
                    if(result.location != null) {
                        $.each(returnCountries(), function(index, country){
                            if(result.location.includes(country.name)) {
                                console.log(result.location);
                                avatars(result, value);
                                var iso = country.id;
                                if (value.type == 'PushEvent'){
                                    githubMap.updateChoropleth({
                                      [iso]: '#17becf'
                                    });
                                } else if (value.type == 'IssueCommentEvent'){
                                    githubMap.updateChoropleth({
                                      [iso]: '#e25758'
                                    });
                                } else if (value.type == 'PullRequestEvent'){
                                    githubMap.updateChoropleth({
                                      [iso]: '#1f77b4'
                                    });
                                } else if (value.type == 'IssuesEvent'){
                                    githubMap.updateChoropleth({
                                      [iso]: '#d62728'
                                    });
                                }
                            }
                        }); 
                    }                     
                }
        });
    });
}
function returnCountries(countires) {
    var countriesRepacked = [];
    $.each(countries, function(index, value){
        countriesRepacked.push({id: value.id, name: value.properties.name});
    });
    return countriesRepacked;
}
function avatars(result, value) {
    if($('.avatars img').length >= 29) {
        $('.avatars a').remove();
        appendAvatars(result, value);
    } else {
        appendAvatars(result, value);
    }
}
function appendAvatars(result, value, country) {
    $('.avatars').append('<a href="' + value.url + '" target="_blank" data-country="' + result.location + '"><img src="' + result.avatar_url + '" title="' + result.html_url + ' [' + value.type + ']" class="full-opacity"/></a>');
    if(value.type != "PushEvent") 
        setTimeout(function(){$('.avatars a img').removeClass('full-opacity')}, 1000);

}