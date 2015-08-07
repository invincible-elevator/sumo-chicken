var update = function(){
  console.log('update working');

  game.physics.arcade.collide(player, platforms);

  if(cursors.left.isDown) {
    player.body.velocity.x = -150;
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150;
  } else {
    player.body.velocity.x = 0;
  }

  if(jumpButton.isDown && player.body.touching.down) {
    player.body.velocity.y = -850
  }

}; 