var preload = function(){
  console.log('preload working');

  game.load.spritesheet('chicken', 'assets/Chicken.png', 32, 32);
  game.load.image('platform', 'assets/platform.png');

  game.stage.smoothed = false

};