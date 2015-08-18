var Lobby = require('./Lobby.js').Lobby;

// All lobbies
var lobbies = []; 
var maxLobbySize = 6;

// Hash takes socketID and gives lobbyID
var playerLobbies = {}; // to improve lookup when finding lobby that a player is in

/* Helper function: gets the next lobby with an empty space 
 * returns a tuple of lobbyID and position in the lobby
 */
var getNextLobby = function() {

  var lobby;
  for (var i = lobbies.length - 1; i >= 0; i--) {
    if (!lobbies[i].full()) {
      lobby = lobbies[i];
    }
  }

  if (!lobby) {
    lobby = new Lobby(maxLobbySize);
  }

  lobbies.push(lobby);
  return lobby;
};

// Given a new socketID, inserts the new player into a lobby
var addToLobby = function(socketID) {
  var openLobby = getNextLobby();
  openLobby.addPlayer(socketID);
  playerLobbies[socketID] = openLobby;
};

// Given a socketID from a disconnected player, removes the player from a lobby
var removeFromLobby = function(socketID) {
  var playerLobby = playerLobbies[socketID];
  playerLobby.removePlayer(socketID);

  delete playerLobbies[socketID];
};

// Gets a player's lobby information given a player's socketID
var getLobbyById = function(socketID) {
  return playerLobbies[socketID];
};

module.exports = {
  addToLobby : addToLobby,
  removeFromLobby : removeFromLobby,
  getLobbyById : getLobbyById
};
