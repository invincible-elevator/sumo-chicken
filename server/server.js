var express     = require('express'),
    http        = require('http'),
    path        = require('path'),
    playerUtils = require('./playerUtils.js');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '../public')));

server.listen(port);

io.on('connection', function(socket) {
  console.log('Connected: ', socket.id);
  playerUtils.newPlayer(socket.id);

  socket.on('death', function(data) {
    console.log('Death: ', socket.id, 'Killed by: ', data.killer);
    playerUtils.resetKills(socket.id);
    if (data.killer !== null) playerUtils.incrementKills(data.killer);

    socket.emit('newLocation', playerUtils.getStartLoc());
    playerUtils.newPlayer(socket.id);
  });

  socket.on('sync', function(data) {
    playerUtils.updatePlayer(socket.id, data);
  });

  socket.on('pause', function() {
    playerUtils.pausePlayer(socket.id,true);
  });

  socket.on('resume', function() {
    playerUtils.pausePlayer(socket.id,false);
  });

  socket.on('disconnect', function() {
    console.log('Disconnected: ', socket.id);
    playerUtils.dcPlayer(socket.id);
  });
});

// Tell the player to sync with ther server every 50ms (approx 2 frames)
setInterval(function() {
  io.sockets.emit('sync', playerUtils.getPlayers());
}, 50);
