var create = function(){
  console.log(game.camera)

  // game.camera.y = 0; 

  game.world.setBounds(-2000, -2000, 4000, 4000);
  game.camera.x = -game.camera.width / 2;
  game.camera.y = -game.camera.height / 2;

  console.log(game.camera.x, game.camera.y)
  var platformLocations = [[200,0, 'platform'], [-250,-300, 'platform'], [-250,300, 'platform'], [-700,0, 'platform']];

  console.log('create working');
  
  game.physics.startSystem(Phaser.Physics.ARCADE);

  player = game.add.sprite(0, -1000, 'chicken');
  
  game.physics.arcade.enable(player);
  // game.physics.arcade.enable(platform);

  // create platforms
  platforms = game.add.group();
  platforms.enableBody = true;
  
  platformLocations.forEach(function(platformCoords){
    var platform = platforms.create(platformCoords[0],platformCoords[1], platformCoords[2]);
    platform.body.immovable = true;
  });

  player.body.gravity.y = 980;

  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  cursors = game.input.keyboard.createCursorKeys();

};