var serverUtils = require('./serverUtils.js');

var playerInformation = {};

var startingLocation = {x: 0,
                        y: 0};

var Player = function() {
  return {
    username: '',
    velocityX: 0,
    velocityY: 0,
    positionX: startingLocation.x,
    positionY: startingLocation.y,
    dashingBool: false,
    kills: 0,
    paused: false,
  };
};

var getPlayers = function() {
  return playerInformation;
};

var getPlayersByLobby = function(socketID) {
  var lobby = serverUtils.getLobbyById(socketID);
  var playerIDs = lobby.getPlayerIDs();
  
  var players = {};
  var id;
  for (var i = 0; i < playerIDs.length; i++) {
    id = playerIDs[i];
    players[id] = playerInformation[id];
  }
  return players;
};

var getStartLoc = function() {
  return startingLocation;
};

var newPlayer = function(socketID) {
  var oldUsername;
  if (playerInformation[socketID]) oldUsername = playerInformation[socketID].username;
  playerInformation[socketID] = Player();
  if (oldUsername) playerInformation[socketID].username = oldUsername;
  serverUtils.addToLobby(socketID);
};

var setUsername = function(socketID, username) {
  playerInformation[socketID].username = username;
};

var updatePlayer = function(socketID, data) {
  playerInformation[socketID].positionX = data.PX;
  playerInformation[socketID].positionY = data.PY;
  playerInformation[socketID].velocityX = data.VX;
  playerInformation[socketID].velocityY = data.VY;
  playerInformation[socketID].dashingBool = data.dashBool;
};

var dcPlayer = function(socketID) {
  delete playerInformation[socketID];
  serverUtils.removeFromLobby(socketID);
};

var incrementKills = function(socketID) {
  playerInformation[socketID].kills ++;
};

var resetKills = function(socketID) {
  playerInformation[socketID].kills = 0;
};

var pausePlayer = function(socketID, pausedOrResumed) {
  playerInformation[socketID].paused = pausedOrResumed;
};

module.exports = {
  newPlayer : newPlayer,
  setUsername : setUsername,
  updatePlayer: updatePlayer,
  dcPlayer : dcPlayer,
  getPlayers : getPlayers,
  getPlayersByLobby : getPlayersByLobby,
  getStartLoc : getStartLoc,
  incrementKills : incrementKills,
  resetKills : resetKills,
  pausePlayer: pausePlayer
};