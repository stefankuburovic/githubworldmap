var request = require('request'),
app = require('express')(),
http = require('http').Server(app),
io = require('socket.io')(http),
path = require('path');


app.get('/', function(req, res){
  res.sendfile('index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var allClients = [];

// When a socket connection is created
io.on('connection', function (socket) {
  allClients.push(socket);

  socket.on('disconnect', function() {
     console.log('Got disconnect!');
     var i = allClients.indexOf(socket);
     allClients.splice(i, 1);
  });

  socket.on('error', function(){
    console.log('Got errored!');
  })
socket.on('github', function (data) {
    if(typeof data != "undefined") {
        $.each(data, function(index, value){
            githubCountries(value);
        });
    }
});
});

function fetchDataFromGithub(){
  var options = {
    url: "https://api.github.com/events?access_token=d5ff040dc8b844863a9256b51b4ef8a53a7bfcd3",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36'
    }
  };
  request(options, function (error, response, body) {
	if (!error && response.statusCode == 200) {
	  var data = JSON.parse(body);
	  var stripedData = stripData(data);  // Keep only useful keys
	  allClients.forEach(function(socket){
	    if(socket != null && socket.connected == true){
	        socket.volatile.json.emit('github', {data: stripedData});
	    }
	  });

	}else{
	  console.log("GitHub status code: " + response.statusCode);
	}
	});
	setTimeout(fetchDataFromGithub, 4000);
}
setTimeout(fetchDataFromGithub, 4000);

function stripData(data){
  var stripedData = [];
  var pushEventCounter = 0;
  var IssueCommentEventCounter = 0;
  var IssuesEventCounter = 0;
  data.forEach(function(data){
    if(data.type == 'PushEvent'){
      if(pushEventCounter > 3) return;
      if(data.payload.size != 0){
        stripedData.push({
          'id': data.id,
          'type': data.type,
          'user': data.actor.display_login,
          'user_avatar': data.actor.avatar_url + 'v=3&s=64',
          'user_url': data.actor.url,
          'repo_id': data.repo.id,
          'repo_name': data.repo.name,
          'payload_size': data.payload.size,
          'message': data.payload.commits[0].message,
          'created': data.created_at,
          'url': data.repo.url
        });
        pushEventCounter++;
      }
    }else if(data.type == 'IssueCommentEvent'){
      stripedData.push({
        'id': data.id,
        'type': data.type,
        'user': data.actor.display_login,
        'user_avatar': data.actor.avatar_url + 'v=3&s=64',
          'user_url': data.actor.url,
        'repo_id': data.repo.id,
        'repo_name': data.repo.name,
        'payload_size': 0,
        'message': data.body,
        'created': data.created_at,
        'url': data.payload.comment.html_url
      });
    }else if(data.type == 'PullRequestEvent'){
      if (data.payload.pull_request.merged) data.payload.action = 'merged';
      stripedData.push({
        'id': data.id,
        'type': data.type,
        'user': data.actor.display_login,
        'user_avatar': data.actor.avatar_url + 'v=3&s=64',
          'user_url': data.actor.url,
        'repo_id': data.repo.id,
        'repo_name': data.repo.name,
        'action': data.payload.action,  // opened, reopened, closed, merged
        'message': data.payload.pull_request.title,
        'created': data.created_at,
        'url': data.payload.pull_request.html_url
      });
    }else if(data.type == 'IssuesEvent'){
      stripedData.push({
        'id': data.id,
        'type': data.type,
        'user': data.actor.display_login,
        'user_avatar': data.actor.avatar_url + 'v=3&s=64',
          'user_url': data.actor.url,		
        'repo_id': data.repo.id,
        'repo_name': data.repo.name,
        'action': data.payload.action,  // opened, reopened, closed
        'message': data.payload.issue.title,
        'created': data.created_at,
        'url': data.payload.issue.html_url
      });
    }
  });
  return stripedData;
}
