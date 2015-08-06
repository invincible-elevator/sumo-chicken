var preload = function(){
  console.log('preload working');
};
var create = function(){
  console.log('create working');
};
var update = function(){
  console.log('update working');
}; 

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update});

