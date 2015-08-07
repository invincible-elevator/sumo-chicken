var create = function(){

  game.world.setBounds(-2000, -2000, 4000, 4000);
  
  game.camera.x = -game.camera.width / 2;
  game.camera.y = -game.camera.height / 2;

  var platformLocations = [[200,0, 'platform'], [-250,-300, 'platform'], [-250,300, 'platform'], [-700,0, 'platform']];
  
  game.physics.startSystem(Phaser.Physics.ARCADE);

  player = game.add.sprite(0, -1000, 'chicken');
  
  game.physics.arcade.enable(player);

  // create platforms
  platforms = game.add.group();
  platforms.enableBody = true;
  
  platformLocations.forEach(function(platformCoords){
    var platform = platforms.create(platformCoords[0],platformCoords[1], platformCoords[2]);
    platform.body.immovable = true;
  });

  player.body.gravity.y = 980;

  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  
  dashButton = game.input.keyboard.addKey(Phaser.Keyboard.C);

  dashButton.onDown.add(function() {
    var sign = Math.sign(player.body.velocity.x);
    player.body.velocity.x += sign * 1000;
  }, this);



  cursors = game.input.keyboard.createCursorKeys();

};