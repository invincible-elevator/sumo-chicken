console.log('loadingplayer.js')

Player = function(game, x,y) {

  Phaser.Sprite.call(this, game, x, y, 'chicken');

  game.physics.arcade.enable(this);
  
  this.body.gravity.y = 980;

  this.anchor.setTo(.5, .5);
  this.animations.add('walking', [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 10, true);
  this.animations.add('flying', [18, 19, 20, 21, 22, 23], 10, true);
  this.animations.add('pecking', [0, 1, 2, 3, 4, 5])
  
  this.scale.setTo(2, 2);
  this.body.setSize(this.body.width - 16, 
                      this.body.height - 10, 
                      0, 4);

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;

  this.events.onKilled.add(function() {
    console.log('Woe is me!!!');

    socket.emit('death');
  })


}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;