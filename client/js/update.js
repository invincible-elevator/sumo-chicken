playerMaxSpeed = 300;
playerGroundAccleration = 30;
playerAirAccleration = 20;
playerDecceleration = 20;

syncTimer = 0;
var syncRate = 2;
var stopping = null;
var stoppingTime = -100;

var update = function(){

  if (player) {
    var score = game.add.bitmapText(-100,
                                  - game.camera.height / 2 + 30, 
                                  'carrier_command', 
                                  'SCORE:'+player.score, 30);
    score.lifespan = 1;
  }

  // By waiting for the next sync before stopping, I believe this improves hit detection online
  // if (stoppingTime + syncRate === syncTimer) {
  //   stopping.body.velocity.x = 0;
  // }

  var collideChickens = function(otherChicken, thisChicken) {
    thisChicken.lastCollidedWith = otherChicken.socketId;
    var right;
    var left;
    if (otherChicken.x > thisChicken.x) {
      right = otherChicken;
      left = thisChicken;
    } else {
      right = thisChicken;
      left = otherChicken;
    }

    var diff = otherChicken.body.velocity.x + thisChicken.body.velocity.x;
    if (diff > 0) {
      // left.body.velocity.x = 0;
      right.body.velocity.x = right.body.velocity.x * 1.5;
      stopping = left;
    } else {
      // right.body.velocity.x = 0;
      left.body.velocity.x = left.body.velocity.x * 1.5;
      stopping = right;
    }
    stopping.body.velocity.x = 0;
    stoppingTime = syncTimer;
  };

  game.physics.arcade.collide(player, platforms);

  // Ensure that players cannot go through the platforms if other players jump on them
  game.physics.arcade.overlap(player, platforms, function(playerSprite, platform) {
    var abovePlatform = platform.top - (playerSprite.height/2) - 5; // 5 is to offset player.js line 18
    playerSprite.y = abovePlatform;
  });

  for (var key in otherChickens) {
    game.physics.arcade.collide(otherChickens[key], player, collideChickens);
    game.physics.arcade.collide(otherChickens[key], platforms);
    addAnimations(otherChickens[key]);
  }



  if(cursors.left.isDown && player.body.velocity.x > -playerMaxSpeed) {
    player.body.velocity.x -= (player.body.touching.down ? playerGroundAccleration : playerAirAccleration);
    player.scale.x = 2;

  } else if (cursors.right.isDown && player.body.velocity.x < playerMaxSpeed) {
    player.body.velocity.x += (player.body.touching.down ? playerGroundAccleration : playerAirAccleration);
    player.scale.x = -2;

  } else {
    if (player.body.velocity.x < 0) {
      if (player.body.touching.down) {
        player.body.velocity.x = Math.min(player.body.velocity.x + playerDecceleration, 0);
      }

    } else if (player.body.velocity.x > 0) {
      if (player.body.touching.down) {
        player.body.velocity.x = Math.max(player.body.velocity.x - playerDecceleration, 0);
      }

    } else {
      if (player.body.touching.down) {
        player.frame = 0;
      }
    }
  }

  if (player.body.touching.down) {
    if (player.body.velocity.x !== 0) {
      if (!dashButton.isDown) 
        player.animations.play('walking');
    } else {
      player.frame = 0;
    }

    // change animation speed
    player.animations.currentAnim.delay = Math.min(1 / (Math.abs(player.body.velocity.x) * 0.00009), 100);
  }

  // Jump if on ground and move upward until jump runs out or lets go of space
  if(jumpButton.isDown && player.body.touching.down) {
    player.jump();
  } else if (!jumpButton.isDown && !player.body.touching.down) {
    player.stopJump();
  }

  // Increase stored dashMeter
  player.chargeDash();

};


var addAnimations = function(chicken) {
  var mathSign = chicken.body.velocity.x === 0 ? 0 : chicken.body.velocity.x > 0 ? 1 : -1;
  if (mathSign !== 0) {
    chicken.scale.x = mathSign > 0 ? -2 : 2;
  } 
  if (chicken.body.velocity.y !== 0) {
    chicken.animations.stop();
    chicken.frame = 24; 
  } else if (chicken.body.velocity.x !== 0) {
    chicken.animations.play(chicken.dashing ? 'flying' : 'walking');
  } else {
    chicken.frame = 0;
  }
};

var sendSync = function() {
  socket.emit('sync', {'PX': player.x, 
                       'PY': player.y,
                       'VX': player.body.velocity.x, 
                       'VY': player.body.velocity.y,
                       'dashBool': dashButton.isDown
                      }
             );
};