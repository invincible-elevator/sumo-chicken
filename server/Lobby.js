//Lobby is an array wrapper that stores player socketIDs
var Lobby = function(maxSize) {

  var newLobby = {};
  var players = []; //stores socketIDs

  newLobby.full = function() {
    return maxSize <= players.length;
  };

  newLobby.addPlayer = function(socketID) {
    players.push(socketID);
  };

  newLobby.removePlayer = function(socketID) {
    var index = players.indexOf(socketID);
    players.splice(index, 1);
  };

  newLobby.getPlayerIDs = function() {
    return players;
  };

  return newLobby;
};

module.exports = {
  Lobby : Lobby
};