var preload = function(){
  console.log('preload working');

  game.load.image('cat', 'assets/placeholder.png');
  game.load.image('platform', 'assets/platform.png');

};
var create = function(){
  console.log('create working');
  
  game.physics.startSystem(Phaser.Physics.ARCADE);

  var player = game.add.sprite(0, 0, 'cat');
  var platform = game.add.sprite(400, 600, 'platform');
  
  game.physics.arcade.enable(player);
  game.physics.arcade.enable(platform);

  player.body.gravity.y = 980;
  player.body.gravity.y = 980;

};
var update = function(){
  console.log('update working');
}; 

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update});

