class Lobby {
  static lobbies = new Map();

  constructor(gameName, validationData) {
    this.gameName = gameName;
    this.validationData = validationData; 
    this.usernames = []; 
    Lobby.lobbies.set(validationData, this);
  }

  join(encryptedUsername) {
    if (!this.usernames.includes(encryptedUsername)) {
      this.usernames.push(encryptedUsername);
      return true;
    }
    return false;
  }

  listUsers() {
    return this.usernames;
  }
}

module.exports = Lobby;