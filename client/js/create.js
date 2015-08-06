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

  var player = game.add.sprite(0, 0, 'cat');
  var platform = game.add.sprite(400, 600, 'platform');
  
  game.physics.arcade.enable(player);
  game.physics.arcade.enable(platform);

  // create platforms
  platforms = game.add.group();
  platforms.enableBody = true;
  
  platformLocations.forEach(function(platformCoords){
    platforms.create(platformCoords[0],platformCoords[1], platformCoords[2]);
  });

  player.body.gravity.y = 980;

};