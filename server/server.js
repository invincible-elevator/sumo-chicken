var express     = require('express'),
    http        = require('http'),
    path        = require('path'),
    playerUtils = require('./playerUtils.js');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '../client')));

server.listen(port);

io.on('connection', function(socket) {
  console.log('Connected: ', socket.id);
  playerUtils.newPlayer(socket.id);

  socket.on('death', function() {
    console.log('Death: ', socket.id);
    socket.emit('newLocation', playerUtils.getStartLoc());
    playerUtils.newPlayer(socket.id);
    // console.log(playerUtils.getPlayers());
  });

  socket.on('sync', function(data) {
    playerUtils.updatePlayer(socket.id, data);
    socket.emit('sync', playerUtils.getPlayers());
    // console.log(playerUtils.getPlayers());
  });

  socket.on('disconnect', function() {
    console.log('Disconnected: ', socket.id);
    playerUtils.dcPlayer(socket.id);
    // console.log(playerUtils.getPlayers());
  });
});




