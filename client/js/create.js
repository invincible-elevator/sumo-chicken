var create = function(){

  var platformLocations = [[400,0, 'platform'], [0,-300, 'platform'], [0,300, 'platform'], [-400,0, 'platform']];

  game.world.setBounds(-2000, -2000, 4000, 4000 );
  
  game.camera.x = -game.camera.width / 2;
  game.camera.y = -game.camera.height / 2;
  
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Create player
  // player = game.add.sprite(0, 0, 'chicken');
  player = game.add.sprite(startingLocation.x, startingLocation.y, 'chicken');

  game.physics.arcade.enable(player);
  
  player.body.gravity.y = 980;

  player.anchor.setTo(.5, .5);
  player.animations.add('walking', [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 10, true);
  player.animations.add('flying', [18, 19, 20, 21, 22, 23], 10, true);
  player.animations.add('pecking', [0, 1, 2, 3, 4, 5])
  
  player.scale.setTo(2, 2);
  player.body.setSize(player.body.width - 16, 
                      player.body.height - 10, 
                      0, 4);

  player.checkWorldBounds = true;
  player.outOfBoundsKill = true;

  player.events.onKilled.add(function() {
    console.log('Woe is me!!!')
  })

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