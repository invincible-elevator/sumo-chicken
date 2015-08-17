Player = function(game, x, y, socketId) {

  var maxSpeed = 300;
  var groundAcceleration = 30;
  var airAcceleration = 20;
  var decceleration = 20;

  var jumpSpeed = -700; // intital speed of chicken jump
  var minJump = 300; // amount jump speed needs to decrease before player can stop jumping
  
  this.dashing = false; // dashing property for other player chickens
  this.dashMeter = 0; // amount of stored dash
  var dashMax = 1500; // maximum value for dash
  
  this.socketId = socketId;
  this.lastCollidedWith = null;
  this.score = 0;

  this.paused = false;
  this.hasNameLabel = false;

  Phaser.Sprite.call(this, game, x, y, 'chicken');

  // create physics
  game.physics.arcade.enable(this);
  this.body.gravity.y = 1300;

  // create animations and graphics
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('walking', [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 10, true);
  this.animations.add('flying', [18, 19, 20, 21, 22, 23], 10, true);
  this.animations.add('pecking', [0, 1, 2, 3, 4, 5]);
  
  this.scale.setTo(2, 2);
  this.body.setSize(this.body.width - 16, 
                    this.body.height - 10,
                    0, 4);

  this.checkWorldBounds = true;

  if (!socketId) {
    this.outOfBoundsKill = true;

    currentChicken = this;
    this.events.onKilled.add(function() {

      console.log('Woe is me!!!');

        var loser = game.add.bitmapText(-250,
                                        -200, 
                                        'carrier_command', 
                                        'YOU DIED', 50);
        loser.fixedToCamera = true;
        loser.cameraOffset.setTo(game.camera.width / 2 - 250, game.camera.height / 2);

        loser.lifespan = 2000;


      game.time.events.add(1000, function() {
        socket.emit('death', { 'killer' : currentChicken.lastCollidedWith });
      });
    });
  }

  this.moveLeft = function() {
    if (this.body.velocity.x > -maxSpeed) {
      this.body.velocity.x -= (this.body.touching.down ? groundAcceleration : airAcceleration);
      this.scale.x = 2;
    }
  };

  this.moveRight = function() {
    if (this.body.velocity.x < maxSpeed) {
      this.body.velocity.x += (this.body.touching.down ? groundAcceleration : airAcceleration);
      this.scale.x = -2;
    }
  };

  this.decelerate = function() {
    if (this.body.velocity.x < 0) {
      if (this.body.touching.down) {
        this.body.velocity.x = Math.min(this.body.velocity.x + decceleration, 0);
      }

    } else if (this.body.velocity.x > 0) {
      if (this.body.touching.down) {
        this.body.velocity.x = Math.max(this.body.velocity.x - decceleration, 0);
      }

    } else {
      if (this.body.touching.down) {
        this.frame = 0;
      }
    }
  };

  this.jump = function() {
    this.body.velocity.y = jumpSpeed;
    this.animations.stop();
    this.frame = 24;
  };

  this.stopJump = function() {
    if (this.body.velocity.y < 0 && this.body.velocity.y > jumpSpeed + minJump) {
      this.body.velocity.y = 0;
    }
  };

  this.dash = function() {
    var mathSign = player.scale.x > 0 ? 1 : -1;
    player.body.velocity.x += -mathSign * this.dashMeter;
    this.dashMeter = 0;

    this.animations.play('flying');
  };

  this.chargeDash = function() {
    if (this.dashMeter < dashMax / 3) {
      this.dashMeter += 6; 
      this.tint = 0xffffff;     
    } else if (this.dashMeter < dashMax * 2 / 3) {
      this.dashMeter += 4;
      this.tint = 0xffccff;     
    } else if (this.dashMeter < dashMax) {
      this.dashMeter += 2;
      this.tint = 0xff99ff;     
    } else {
      this.tint = 0xff66ff;
    }
  };

  // level is an integer that starts at 0
  this.setLevel = function(level) {

    var bonus = (level * 0.25 + 1);

    maxSpeed = 300 * bonus;
    groundAcceleration = 30 * bonus;
    airAcceleration = 20 * bonus;
    deceleration = 20 * bonus;

    jumpSpeed = -700 * Math.sqrt(bonus);
  };

  this.addUsernameLabel = function(username) {
    if (!this.hasNameLabel) {
      var color = !this.socketId ? '0xff0000' : '0xffffff';
      label = game.add.bitmapText(-12, -25, 'carrier_command', username, 8);
      label.tint = color;
      this.addChild(label);
      this.hasNameLabel = true;
    }
  };

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;