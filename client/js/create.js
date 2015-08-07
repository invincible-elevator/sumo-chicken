var create = function(){

  var platformLocations = [[400,0, 'platform'], [0,-300, 'platform'], [0,300, 'platform'], [-400,0, 'platform']];

  game.world.setBounds(-2000, -2000, 4000, 4000 );
  
  game.camera.x = -game.camera.width / 2;
  game.camera.y = -game.camera.height / 2;
  
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Create the initial player
  player = new Player(game, 0, 0);
  game.add.existing(player);


  // Respawns the player 
  socket.on('newLocation', function(data){
    player = new Player(game, data.x, data.y);
    game.add.existing(player);
  });


  // Create platforms
  platforms = game.add.group();
  platforms.enableBody = true;
  
  platformLocations.forEach(function(platformCoords){
    var platform = platforms.create(platformCoords[0],platformCoords[1], platformCoords[2]);
    platform.anchor.setTo(.5, .5);
    platform.body.immovable = true;
  });

  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  dashButton = game.input.keyboard.addKey(Phaser.Keyboard.C);

  dashButton.onDown.add(function() {
    player.body.velocity.x = -Math.sign(player.scale.x) * 1000;
    player.animations.play('flying');
  }, this);

  cursors = game.input.keyboard.createCursorKeys();

};