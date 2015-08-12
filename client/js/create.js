var bpmText;

var create = function(){
  //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
  this.stage.disableVisibilityChange = true;

  // platforms are [x, y, spriteKey, scale] and ordered by height
  var platformLocations = [[0, -200, 'platform', 2],
                           [-450, -25, 'platform', 2], [450, -25, 'platform', 2],
                           [0, -75, 'cloud', 1],
                           [0, 100, 'platform', 2],
                           [200, 200, 'cloud', 1], [-200, 200, 'cloud', 1],
                           [0, 300, 'cloud', 1],
                           [400, 350, 'platform', 2], [-400, 350, 'platform', 2]];

  game.world.setBounds(-2000, -2000, 4000, 4000 );
  game.time.desiredFps = 45;
  
  game.camera.x = -game.camera.width / 2;
  game.camera.y = -game.camera.height / 2;
  
  game.physics.startSystem(Phaser.Physics.ARCADE);

  background = game.add.tileSprite(-2000, -400, 4000, 400, "background");
  background.scale.x = 2;
  background.scale.y = 2;

  lava = game.add.tileSprite(-2000, 365,4000,180,"lava");
  lava.scale.x = 1;


  // instructions
  var margin = 10;
  bmpText = game.add.bitmapText(-game.camera.width / 2 + margin,
                                -game.camera.height / 2 + margin, 
                                'carrier_command', 
                                'Move: arrow keys\n\nJump: SPACEBAR\n\nDash: C', 17);

  game.time.events.add(6000, function() {
    game.add.tween(bmpText).to({y: -170}, 1500, Phaser.Easing.Linear.None, true);
    game.add.tween(bmpText).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
  }, this);


  // Create the initial player
  player = new Player(game, 0, 0, true);
  game.add.existing(player);
  lava.bringToTop(); // player falls behind lava

  otherChickens = {};

  // Respawns the player 
  socket.on('newLocation', function(data){
    player = new Player(game, data.x, data.y, true);
    game.add.existing(player);
    lava.bringToTop();

  });

  socket.on('sync', function(data){
    var syncKeys = Object.keys(data);
    syncKeys.forEach(function(key) {
      if (key !==socket.id) {
        if (otherChickens[key]) {
          // console.log(otherChickens[key].x,otherChickens[key].y)
          otherChickens[key].x = data[key].positionX;
          otherChickens[key].y = data[key].positionY;
          otherChickens[key].body.velocity.x = data[key].velocityX;
          otherChickens[key].body.velocity.y = data[key].velocityY;
        } else {
          newChicken = new Player(game, data[key].positionX, data[key].positionY, false);
          game.add.existing(newChicken);
          otherChickens[key] = newChicken;
        }
      }
    });
    for (var key in otherChickens) {
      if (syncKeys.indexOf(key) === -1) {
        delete otherChickens[key];
      }
    }
  });


  // Create platforms
  platforms = game.add.group();
  platforms.enableBody = true;
  
  platformLocations.forEach(function(platformCoords){
    var platform = platforms.create(platformCoords[0],platformCoords[1], platformCoords[2]);
    platform.scale.x = platformCoords[3];
    platform.scale.y = platformCoords[3];
    platform.anchor.setTo(0.5, 0.5);
    platform.body.immovable = true;
  });

  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  dashButton = game.input.keyboard.addKey(Phaser.Keyboard.C);

  dashButton.onDown.add(function() {
    var mathSign = player.scale.x > 0 ? 1 : -1;
    player.body.velocity.x += -mathSign * player.dash();
    player.animations.play('flying');
  }, this);

  cursors = game.input.keyboard.createCursorKeys();

};
