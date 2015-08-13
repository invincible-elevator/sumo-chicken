var playerInformation= {};

var startingLocation = {x: 0,
                        y: 200};

var getPlayers = function(socketID) {
  return playerInformation;
};

var getStartLoc = function() {
  return startingLocation;
};

var newPlayer = function(socketID) {
  playerInformation[socketID] = {
    velocityX: 0,
    velocityY: 0,
    positionX: startingLocation.x,
    positionY: startingLocation.y,
    dashingBool: false,
    kills: 0
  };
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
};

var incrementKills = function(socketID) {
  playerInformation[socketID].kills ++;
};

var resetKills = function(socketID) {
  playerInformation[socketID].kills = 0;
};

module.exports = {
  newPlayer: newPlayer,
  updatePlayer: updatePlayer,
  dcPlayer: dcPlayer,
  getPlayers: getPlayers,
  getStartLoc: getStartLoc,
  incrementKills: incrementKills,
  resetKills: resetKills
};