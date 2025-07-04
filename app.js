const express = require('express');
const bodyParser = require('body-parser');
const Lobby = require('./lobby'); // Ensure this file exports the Lobby class

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Create a new lobby
app.post('/createLobby', (req, res) => {
  const { gameName, validationData, username } = req.body;
  if (!gameName || !validationData || !username) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }
  
  // Create a new lobby and join the user
  const lobby = new Lobby(gameName, validationData);
  lobby.join(username);
  
  return res.json({ status: 'success' });
});

// Join an existing lobby
app.post('/joinLobby', (req, res) => {
  const { gameName, username } = req.body; // Use validationData to find the lobby
  if (!gameName || !username) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }
  const lobbyEntry = Array.from(Lobby.lobbies.entries()).find(([_, lobby]) => lobby.gameName === gameName);
  const [validationData, lobby] = lobbyEntry;
  if (!lobby) {
    return res.status(404).json({ status: 'error', message: 'Lobby not found' });
  }
  
  lobby.join(username);
  return res.json({ status: 'success' });
});

// Get the list of existing lobbies
app.post('/getLobbies', (req, res) => {
  const lobbyList = Array.from(Lobby.lobbies.entries()).map(([validationData, lobby]) => ({
    gameName: lobby.gameName,
    validationData: validationData,
  }));
  
  return res.json({ status: 'success', lobbies: lobbyList });
});

// Get the list of existing lobbies
app.post('/getUsers', (req, res) => {
  const { gameName } = req.body;
  if (!gameName) {
    return res.status(400).json({ status: 'error', message: 'Missing required field' });
  }

  const lobbyEntry = Array.from(Lobby.lobbies.entries()).find(([_, lobby]) => lobby.gameName === gameName);
  if (!lobbyEntry) {
    return res.status(404).json({ status: 'error', message: 'Lobby not found' });
  }

  const [validationData, lobby] = lobbyEntry;
  const userList = lobby.listUsers(); 
  return res.json({ status: 'success', usernames: userList });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
