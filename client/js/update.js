playerMaxSpeed = 500;
playerAccleration = 14;
playerDecceleration = 9;

syncTimer = 0;

var update = function(){
  var syncRate = 3; // should be 3

  if (syncTimer % syncRate === 0) {
    socket.emit('sync', {'PX':player.x, 'PY':player.y,
                         'VX':player.body.velocity.x, 'VY': player.body.velocity.y,
                         'dashBool':player.dashing});
    // console.log(otherChickens)
  }
  syncTimer ++;

  game.physics.arcade.collide(player, platforms);

  for (var key in otherChickens) {
    game.physics.arcade.collide(otherChickens[key], platforms);
    game.physics.arcade.collide(otherChickens[key], player);
    addAnimations(otherChickens[key]);
  }

  if(cursors.left.isDown && player.body.velocity.x > -playerMaxSpeed) {
    player.body.velocity.x -= playerAccleration;
    player.scale.x = 2;

  } else if (cursors.right.isDown && player.body.velocity.x < playerMaxSpeed) {
    player.body.velocity.x += playerAccleration;
    player.scale.x = -2;

  } else {
    if (player.body.velocity.x < 0) {
      player.body.velocity.x = Math.min(player.body.velocity.x + playerDecceleration, 0);

    } else if (player.body.velocity.x > 0) {
      player.body.velocity.x = Math.max(player.body.velocity.x - playerDecceleration, 0);

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
  }

  // Makes the app take double the processing, but looks good
  // player.animations.currentAnim.speed = Math.abs(player.body.velocity.x / 8) + 5;

  // Takes almost no processing, but looks worse

  if (player.body.touching.down) {
    player.animations.currentAnim.delay = Math.min(1 / (Math.abs(player.body.velocity.x) * 0.00009), 100);
  }

  // Jump if on ground and move upward until jump runs out or lets go of space
  var jumpSpeed = -850;
  if(jumpButton.isDown && player.body.touching.down) {
    player.body.velocity.y = jumpSpeed;
    player.animations.stop();
    player.frame = 24; 

  } else if (!jumpButton.isDown && !player.body.touching.down) {
    if (player.body.velocity.y < 0 && player.body.velocity.y > jumpSpeed + 100) {
      player.body.velocity.y = 0;
    }
  }

  // Increase stored dashMeter
  player.chargeDash();

}; 


var addAnimations = function(chicken) {
  var mathSign = chicken.body.velocity.x > 0 ? 1 : -1;
  if (chicken.body.velocity.x === 0) mathSign = 0;
  if (mathSign === 1) {
    chicken.scale.x = -2;
  } else if (mathSign === -1) {
    chicken.scale.x = 2;
  }
  if (chicken.body.velocity.y !== 0) {
    chicken.animations.stop();
    chicken.frame = 24; 
  } else if (chicken.body.velocity.x !== 0) {
    if (chicken.dashing === true) {
      chicken.animations.play('flying');
    } else {
      chicken.animations.play('walking');
    }
  } else {
    chicken.frame = 0;
  }
};