socket = io.connect('http://localhost:8080');

socket.on('startingLocation', function(data){
  startingLocation = data;
})

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update});

