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
var watchingTranslated = {}, randomTranslate = {};
$.getJSON('watching.json').done(function(data){
    watchingTranslated = data;
});
socket.on('github', function (data) {
    if(typeof data != "undefined") {
        $.each(data, function(index, value){
            githubCountries(value);
        $('#push-request .total').html(value.pushEventCounter);
        $('#pull-request .total').html(value.pullRequestEventCounter);
        $('#issue-event-request .total').html(value.IssueEventCounter);
        $('#issue-comment-event-request .total').html(value.IssueCommentEventCounter);
        });
        setTimeout(function(){
            function pickRandomQuestion(){
                    var obj_keys = Object.keys(watchingTranslated);
                    var ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
                    randomTranslate = watchingTranslated[ran_key];
            }
            pickRandomQuestion();
            $('.watching').html(data.connectedUsers + ' ' + randomTranslate.string);
        }, 3000);
    }
});
function githubCountries(data) {
    $.each(data, function(index, value){
        $.ajax({
            url: value.user_url + "?access_token=token",
            crossDomain: true,
            success: function(result) {
                    if(result.location != null) {
                        $.each(returnCountries(), function(index, country){
                            if(result.location.includes(country.name)) {
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
                                } else if (value.type == 'ForkEvent'){
                                    githubMap.updateChoropleth({
                                      [iso]: '#cfcfcf'
                                    });
                                } else if (value.type == 'DeleteEvent'){
                                    githubMap.updateChoropleth({
                                      [iso]: '#800000'
                                    });
                                } else if (value.type == 'CreateEvent'){
                                    githubMap.updateChoropleth({
                                      [iso]: '#d4a74b'
                                    });
                                } else if (value.type == 'PullRequestEvent'){
                                    githubMap.updateChoropleth({
                                      [iso]: '#768266'
                                    });
                                } else if (value.type == 'PullRequestReviewCommentEvent') {
                                    githubMap.updateChoropleth({
                                      [iso]: '#a72971'
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
function appendAvatars(result, value) {
    if(!value.type == "PushEvent") {
        $('.avatars').append('<a href="' + value.url + '" target="_blank" data-country="' + result.location + '" data-api-user="' + result.url + '"><img src="' + result.avatar_url + '" title="' + result.html_url + ' [' + value.type + ']" class="full-opacity"/></a>');
    } else {
        $('.avatars').append('<a href="' + result.html_url + '" target="_blank" data-country="' + result.location + '" data-api-user="' + result.url + '"><img src="' + result.avatar_url + '" title="' + result.html_url + ' [' + value.type + ']" class="full-opacity"/></a>');
    }
    if(value.type != "PushEvent") 
        setTimeout(function(){$('.avatars a img').removeClass('full-opacity')}, 1000);

}