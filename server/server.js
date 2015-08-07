var express   = require('express'),
    http      = require('http'),
    path      = require('path');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '../client')));

server.listen(port);


io.on('connection', function(socket) {
  console.log('Connected: ', socket.id);

  var startingLocation = {x: 0,
                          y: 0};

  socket.emit('startingLocation', startingLocation);

  socket.on('movement', function(data) {

  })

  socket.on('disconnect', function() {
    console.log('Disconnected: ', socket.id);
  });
});


