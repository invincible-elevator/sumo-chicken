playerMaxSpeed = 500;
playerAccleration = 14;
playerDecceleration = 9;

var update = function(){
  console.log('update working');

  game.physics.arcade.collide(player, platforms);

  if(cursors.left.isDown && player.body.velocity.x > -playerMaxSpeed) {
    player.body.velocity.x -= playerAccleration;

  } else if (cursors.right.isDown && player.body.velocity.x < playerMaxSpeed) {
    player.body.velocity.x += playerAccleration;
  } else {
    if(player.body.velocity.x < 0) {
      player.body.velocity.x += playerDecceleration;
    } else {
      player.body.velocity.x -= playerDecceleration;
    }
  }



  if(jumpButton.isDown && player.body.touching.down) {
    player.body.velocity.y = -850
  }

}; 