var startGame = function() {
  console.log(document.getElementById('username').value);

  var main = document.getElementById('main');
  main.parentNode.removeChild(main);

  game = new Phaser.Game(window.innerWidth, 
                             window.innerHeight, 
                             Phaser.AUTO, 
                             '', 
                             { preload: preload, 
                               create: create, 
                               update: update}
                            );

  return false;
};