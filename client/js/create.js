var bpmText;

var create = function(){

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

  // draw a red colored rectangle to go below lava
  var graphics = game.add.graphics(0, 0);
  graphics.beginFill(0xDD2200, 1);
  graphics.drawRect(-2000,0, 4000, 4000);
  graphics.endFill();

  //  Phaser will automatically pause if the browser tab the game is in loses focus. Disabled this below.
  //  NOTE: Uncomment the following line for testing if you want to have two games playing in two browsers.
  // this.stage.disableVisibilityChange = true;

  background = game.add.tileSprite(-2000, -400, 4000, 400, "background");
  background.scale.x = 2;
  background.scale.y = 2;

  lava = game.add.tileSprite(-2000, 365,4000,180,"lava");
  lava.scale.x = 1;

  // Create instructions
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
  player = new Player(game, 0, 0, false);
  game.add.existing(player);
  lava.bringToTop(); // player falls behind lava

  otherChickens = {};

  // Respawns the player 
  socket.on('newLocation', function(data){
    player = new Player(game, data.x, data.y, false);
    game.add.existing(player);
    lava.bringToTop();
  });

  // Syncs player to the server
  socket.on('sync', function(data){
    if (!game.paused) {
      var syncKeys = Object.keys(data);
      syncKeys.forEach(function(key) {
        if (key !== socket.id) {
          if (otherChickens[key]) {
            syncExistingChicken(otherChickens[key], data[key]);
          } else {
            addNewChicken(key, data[key]);
          }
        } else {
          if (player.score !== data[key].kills) {
            player.score = data[key].kills;
            upgradeChicken(player, player.score);
          }
        }
      });
      for (var key in otherChickens) {
        if (syncKeys.indexOf(key) === -1) {
          delete otherChickens[key];
        }
      }

      socket.emit('sync', {'PX': player.x, 
                           'PY': player.y,
                           'VX': player.body.velocity.x, 
                           'VY': player.body.velocity.y,
                           'dashBool': dashButton.isDown
                          });
    }
  });

  // Create platforms
  platforms = game.add.group();
  platforms.enableBody = true;
  
  platformLocations.forEach(function(platformCoords){
    var platform = platforms.create(platformCoords[0], platformCoords[1], platformCoords[2]);
    platform.scale.x = platformCoords[3];
    platform.scale.y = platformCoords[3];
    platform.anchor.setTo(0.5, 0.5);
    platform.body.immovable = true;
  });

  // Create button inputs
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  dashButton = game.input.keyboard.addKey(Phaser.Keyboard.C);

  dashButton.onDown.add(function() {
    player.dash();
  }, this);

  var cameraMargin = 250;
  game.camera.follow(player);
  game.camera.deadzone = new Phaser.Rectangle(cameraMargin, 
                                              cameraMargin, 
                                              game.camera.width - cameraMargin * 2, 
                                              game.camera.height - cameraMargin * 2);
  game.camera.focusOnXY(0, 0);

  cursors = game.input.keyboard.createCursorKeys();

  game.onPause.add(pauseGame, this);
  game.onResume.add(resumeGame, this);  
};

var pauseGame = function() {
  socket.emit('pause');
};

var resumeGame = function() {
  socket.emit('resume');
};

var upgradeChicken = function(chicken, score) {
  // put upgrading system here
  chicken.setLevel(score);
};

var syncExistingChicken = function(chicken, data) {
  if (!data.paused) {
    chicken.body.moves = true;
    chicken.paused = false;
    chicken.x = data.positionX;
    chicken.y = data.positionY;
    chicken.body.velocity.x = data.velocityX;
    chicken.body.velocity.y = data.velocityY;
    if (chicken.score !== data.kills) {
      chicken.score = data.kills;
      upgradeChicken(chicken, data.kills);
    }
  } else {
    chicken.tint = 0x707070;
    chicken.body.moves = false;
    chicken.paused = true;
  }
};

var addNewChicken = function(socketId, data) {
  newChicken = new Player(game, data.positionX, data.positionY, socketId);
  game.add.existing(newChicken);
  otherChickens[socketId] = newChicken;
  otherChickens[socketId].score = data.kills;
  upgradeChicken(otherChickens[socketId], data.kills);
  lava.bringToTop();
};
