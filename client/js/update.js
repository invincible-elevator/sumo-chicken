playerMaxSpeed = 500;
playerAccleration = 14;
playerDecceleration = 9;

var update = function(){
  game.physics.arcade.collide(player, platforms);

  if(cursors.left.isDown && player.body.velocity.x > -playerMaxSpeed) {
    player.body.velocity.x -= playerAccleration;
    
    player.animations.play('walking');
    player.scale.x = 2;

  } else if (cursors.right.isDown && player.body.velocity.x < playerMaxSpeed) {
    player.body.velocity.x += playerAccleration;
    
    player.animations.play('walking');
    player.scale.x = -2;

  } else {
    if (player.body.velocity.x < 0) {
      player.body.velocity.x = Math.min(player.body.velocity.x + playerDecceleration, 0);

    } else if (player.body.velocity.x > 0) {
      player.body.velocity.x = Math.max(player.body.velocity.x - playerDecceleration, 0);

    } else {
      player.frame = 0;
    }
  }

  // Makes the app take double the processing, but looks good
  // player.animations.currentAnim.speed = Math.abs(player.body.velocity.x / 8) + 5;

  // Takes almost no processing, but looks worse
  player.animations.currentAnim.delay = Math.min(1 / (Math.abs(player.body.velocity.x) * .00009), 100);

  if(jumpButton.isDown && player.body.touching.down) {
    player.body.velocity.y = -850
  }

}; 