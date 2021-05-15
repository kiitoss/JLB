const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

class Vote {
  constructor(id, pseudo, vote) {
    this.id = id;
    this.pseudo = pseudo;
    this.vote_value = vote;
  }
}

const list_votes = [];

app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('new user connected : ' + socket.id);
  socket.on('new-player', (pseudo) => {
    list_votes.push(new Vote(socket.id, pseudo, null));
    io.emit('update-votes', list_votes);
  });

  socket.on('new-vote', (vote_value) => {
    list_votes.map(vote => {
      if (vote.id === socket.id) {
        vote.vote_value = vote_value;
        return;
      }
    });
    io.emit('update-votes', list_votes);
  });

  socket.on('change-pseudo', (new_pseudo) => {
    list_votes.map(vote => {
      if (vote.id === socket.id) {
        vote.pseudo = new_pseudo;
        return;
      }
    });
    io.emit('update-votes', list_votes);
  });

  socket.on('start-again', () => {
    list_votes.map(vote => vote.vote_value = null);
    io.emit('restart');
  });

  socket.on('disconnect', () => {
    const index = list_votes.findIndex((el) => el.id == socket.id);
    if (index != -1) {
      list_votes.splice(index, 1);
      io.emit('update-votes', list_votes);
    }
    console.log('user disconnected : ' + socket.id);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});